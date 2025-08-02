import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para configurações do WhatsApp
const whatsappConfigSchema = z.object({
  // Número do WhatsApp
  whatsapp: z.string()
    .regex(/^\+?5[5]\d{2}9?\d{8}$/, 'Formato de WhatsApp inválido. Use: +5511999999999')
    .optional(),
  
  // Templates de mensagem
  orderTemplate: z.string()
    .min(10, 'Template de pedido muito curto')
    .max(1000, 'Template de pedido muito longo')
    .optional(),
  
  confirmationTemplate: z.string()
    .min(10, 'Template de confirmação muito curto')
    .max(500, 'Template de confirmação muito longo')
    .optional(),
  
  readyTemplate: z.string()
    .min(10, 'Template de pronto muito curto')
    .max(500, 'Template de pronto muito longo')
    .optional(),
  
  // Configurações avançadas
  autoSend: z.boolean().optional(),
  requireConfirmation: z.boolean().optional(),
  includeMenuLink: z.boolean().optional(),
  sendStatusUpdates: z.boolean().optional(),
  
  // Configurações de negócio
  businessHours: z.object({
    enabled: z.boolean(),
    start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)').optional(),
    end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)').optional(),
    autoReply: z.string().max(300, 'Resposta automática muito longa').optional()
  }).optional()
})

// Templates padrão
const defaultTemplates = {
  orderTemplate: `Olá! 👋

Gostaria de fazer um pedido no *{{restaurantName}}*:

{{orderItems}}

💰 *Total: {{totalAmount}}*
💳 Forma de pagamento: {{paymentMethod}}
📍 Endereço: {{deliveryAddress}}

Confirma o pedido? 😊`,

  confirmationTemplate: `Pedido confirmado! ✅

*Pedido #{{orderNumber}}*
Tempo estimado: {{estimatedTime}}

Obrigado pela preferência! 🍕`,

  readyTemplate: `Seu pedido está pronto! 🎉

*Pedido #{{orderNumber}}*
{{customerName}}, pode vir buscar ou o entregador já está a caminho!

{{restaurantAddress}}`
}

async function validateRestaurantAccess(userProfileId: string) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: userProfileId },
    include: { restaurant: true }
  })

  if (!userProfile?.restaurant) {
    throw new Error('Restaurante não encontrado')
  }

  return userProfile.restaurant
}

function formatWhatsAppNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Adiciona +55 se não tiver código do país
  if (cleanPhone.length === 11 && cleanPhone.startsWith('9')) {
    return `+55${cleanPhone}`
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    return `+${cleanPhone}`
  }
  
  return phone
}

function validateWhatsAppNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Formato brasileiro: +5511999999999 (13 dígitos com código do país)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    const ddd = cleanPhone.substring(2, 4)
    const number = cleanPhone.substring(4)
    
    // Verificar DDD válido (11-99)
    const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99']
    
    if (!validDDDs.includes(ddd)) {
      return false
    }
    
    // Celular deve começar com 9 e ter 9 dígitos
    return number.length === 9 && number.startsWith('9')
  }
  
  return false
}

// GET /api/admin/whatsapp - Buscar configurações atuais
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    // Buscar configurações do WhatsApp (se existirem)
    const config = await prisma.whatsAppConfig.findUnique({
      where: { restaurantId: restaurant.id }
    })

    const responseData = {
      whatsapp: restaurant.whatsapp || '',
      whatsappFormatted: restaurant.whatsapp ? formatWhatsAppNumber(restaurant.whatsapp) : '',
      isValid: restaurant.whatsapp ? validateWhatsAppNumber(restaurant.whatsapp) : false,
      
      // Templates (usar padrão se não existir configuração)
      orderTemplate: config?.orderTemplate || defaultTemplates.orderTemplate,
      confirmationTemplate: config?.confirmationTemplate || defaultTemplates.confirmationTemplate,
      readyTemplate: config?.readyTemplate || defaultTemplates.readyTemplate,
      
      // Configurações avançadas
      autoSend: config?.autoSend ?? true,
      requireConfirmation: config?.requireConfirmation ?? true,
      includeMenuLink: config?.includeMenuLink ?? false,
      sendStatusUpdates: config?.sendStatusUpdates ?? true,
      
      // Horário comercial
      businessHours: config?.businessHours ? JSON.parse(config.businessHours) : {
        enabled: false,
        start: '08:00',
        end: '22:00',
        autoReply: 'Olá! Estamos fechados no momento. Nosso horário de funcionamento é das 8h às 22h.'
      },
      
      // Estatísticas mock (futuramente vir do banco)
      stats: {
        messagesThisMonth: 127,
        avgResponseTime: '3 min',
        conversionRate: 78,
        isConnected: true,
        lastCheck: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Erro ao buscar configurações WhatsApp:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/whatsapp - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = whatsappConfigSchema.parse(body)

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    // Validar número do WhatsApp se fornecido
    if (validatedData.whatsapp) {
      const formattedNumber = formatWhatsAppNumber(validatedData.whatsapp)
      if (!validateWhatsAppNumber(formattedNumber)) {
        return NextResponse.json(
          { 
            error: 'Número de WhatsApp inválido',
            details: 'Use o formato brasileiro: +5511999999999'
          },
          { status: 400 }
        )
      }
      
      // Atualizar número no restaurante
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { 
          whatsapp: formattedNumber,
          updatedAt: new Date()
        }
      })
    }

    // Upsert configurações do WhatsApp
    const whatsappConfig = await prisma.whatsAppConfig.upsert({
      where: { restaurantId: restaurant.id },
      update: {
        ...(validatedData.orderTemplate && { orderTemplate: validatedData.orderTemplate }),
        ...(validatedData.confirmationTemplate && { confirmationTemplate: validatedData.confirmationTemplate }),
        ...(validatedData.readyTemplate && { readyTemplate: validatedData.readyTemplate }),
        ...(validatedData.autoSend !== undefined && { autoSend: validatedData.autoSend }),
        ...(validatedData.requireConfirmation !== undefined && { requireConfirmation: validatedData.requireConfirmation }),
        ...(validatedData.includeMenuLink !== undefined && { includeMenuLink: validatedData.includeMenuLink }),
        ...(validatedData.sendStatusUpdates !== undefined && { sendStatusUpdates: validatedData.sendStatusUpdates }),
        ...(validatedData.businessHours && { businessHours: JSON.stringify(validatedData.businessHours) }),
        updatedAt: new Date()
      },
      create: {
        restaurantId: restaurant.id,
        orderTemplate: validatedData.orderTemplate || defaultTemplates.orderTemplate,
        confirmationTemplate: validatedData.confirmationTemplate || defaultTemplates.confirmationTemplate,
        readyTemplate: validatedData.readyTemplate || defaultTemplates.readyTemplate,
        autoSend: validatedData.autoSend ?? true,
        requireConfirmation: validatedData.requireConfirmation ?? true,
        includeMenuLink: validatedData.includeMenuLink ?? false,
        sendStatusUpdates: validatedData.sendStatusUpdates ?? true,
        businessHours: validatedData.businessHours ? JSON.stringify(validatedData.businessHours) : JSON.stringify({
          enabled: false,
          start: '08:00',
          end: '22:00',
          autoReply: 'Olá! Estamos fechados no momento. Nosso horário de funcionamento é das 8h às 22h.'
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Configurações do WhatsApp salvas com sucesso',
      data: {
        id: whatsappConfig.id,
        whatsapp: validatedData.whatsapp ? formatWhatsAppNumber(validatedData.whatsapp) : restaurant.whatsapp,
        isValid: validatedData.whatsapp ? validateWhatsAppNumber(formatWhatsAppNumber(validatedData.whatsapp)) : restaurant.whatsapp ? validateWhatsAppNumber(restaurant.whatsapp) : false,
        templates: {
          order: whatsappConfig.orderTemplate,
          confirmation: whatsappConfig.confirmationTemplate,
          ready: whatsappConfig.readyTemplate
        },
        settings: {
          autoSend: whatsappConfig.autoSend,
          requireConfirmation: whatsappConfig.requireConfirmation,
          includeMenuLink: whatsappConfig.includeMenuLink,
          sendStatusUpdates: whatsappConfig.sendStatusUpdates
        }
      }
    })

  } catch (error) {
    console.error('Erro ao salvar configurações WhatsApp:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/whatsapp/test - Testar número do WhatsApp
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { whatsapp } = z.object({
      whatsapp: z.string().min(1, 'Número é obrigatório')
    }).parse(body)

    await validateRestaurantAccess(authUser.profileId)

    const formattedNumber = formatWhatsAppNumber(whatsapp)
    const isValid = validateWhatsAppNumber(formattedNumber)

    // Gerar link de teste
    const testMessage = encodeURIComponent('Olá! Este é um teste de configuração do AllGoMenu. 🚀')
    const testLink = `https://wa.me/${formattedNumber.replace('+', '')}?text=${testMessage}`

    return NextResponse.json({
      success: true,
      data: {
        original: whatsapp,
        formatted: formattedNumber,
        isValid,
        testLink: isValid ? testLink : null,
        message: isValid 
          ? 'Número válido! Use o link de teste para verificar.' 
          : 'Número inválido. Use o formato brasileiro: +5511999999999'
      }
    })

  } catch (error) {
    console.error('Erro ao testar WhatsApp:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
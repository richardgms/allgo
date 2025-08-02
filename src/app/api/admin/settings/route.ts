import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para configurações do restaurante
const restaurantSettingsSchema = z.object({
  // Informações básicas
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10, 'Telefone inválido').max(20, 'Telefone muito longo'),
  address: z.string().min(5, 'Endereço muito curto').max(200, 'Endereço muito longo'),
  city: z.string().min(2, 'Cidade inválida').max(50, 'Cidade muito longa'),
  state: z.string().min(2, 'Estado inválido').max(50, 'Estado muito longo'),
  zipCode: z.string().min(8, 'CEP inválido').max(10, 'CEP inválido'),
  
  // Configurações operacionais
  deliveryFee: z.number().min(0, 'Taxa de entrega deve ser positiva'),
  minOrder: z.number().min(0, 'Valor mínimo deve ser positivo'),
  deliveryRadius: z.number().min(1, 'Raio mínimo é 1km').max(50, 'Raio máximo é 50km'),
  estimatedDeliveryTime: z.number().min(10, 'Tempo mínimo é 10 min').max(180, 'Tempo máximo é 180 min'),
  
  // Horários de funcionamento
  openingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    })
  }),
  
  // PIX
  pixKey: z.string().optional(),
  pixKeyType: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random']).optional(),
  pixReceiverName: z.string().max(100, 'Nome muito longo').optional(),
  
  // WhatsApp
  whatsapp: z.string().optional(),
  
  // Personalização
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária inválida').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária inválida').optional(),
  
  // Estado
  isActive: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar restaurante do usuário
    const userProfile = await prisma.userProfile.findUnique({
      where: { id: authUser.profileId },
      include: {
        restaurant: true
      }
    })

    if (!userProfile?.restaurant) {
      return NextResponse.json({ error: 'Restaurante não encontrado' }, { status: 404 })
    }

    const restaurant = userProfile.restaurant

    // Converter Decimal para number para serialização
    const restaurantData = {
      ...restaurant,
      deliveryFee: Number(restaurant.deliveryFee),
      minOrder: Number(restaurant.minOrder),
      deliveryRadius: Number(restaurant.deliveryRadius),
      estimatedDeliveryTime: Number(restaurant.estimatedDeliveryTime)
    }

    return NextResponse.json({
      success: true,
      data: restaurantData
    })

  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Autenticação
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar restaurante do usuário
    const userProfile = await prisma.userProfile.findUnique({
      where: { id: authUser.profileId },
      include: {
        restaurant: true
      }
    })

    if (!userProfile?.restaurant) {
      return NextResponse.json({ error: 'Restaurante não encontrado' }, { status: 404 })
    }

    // Validar dados de entrada
    const body = await request.json()
    const validatedData = restaurantSettingsSchema.parse(body)

    // Atualizar restaurante
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: userProfile.restaurant.id },
      data: {
        // Informações básicas
        name: validatedData.name,
        description: validatedData.description,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        
        // Configurações operacionais
        deliveryFee: validatedData.deliveryFee,
        minOrder: validatedData.minOrder,
        deliveryRadius: validatedData.deliveryRadius,
        estimatedDeliveryTime: validatedData.estimatedDeliveryTime,
        
        // Horários de funcionamento (JSON)
        openingHours: validatedData.openingHours,
        
        // PIX
        pixKey: validatedData.pixKey,
        pixKeyType: validatedData.pixKeyType,
        pixReceiverName: validatedData.pixReceiverName,
        
        // WhatsApp
        whatsapp: validatedData.whatsapp,
        
        // Personalização
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        
        // Estado
        isActive: validatedData.isActive,
        
        // Timestamp
        updatedAt: new Date()
      }
    })

    // Converter Decimal para number para resposta
    const restaurantData = {
      ...updatedRestaurant,
      deliveryFee: Number(updatedRestaurant.deliveryFee),
      minOrder: Number(updatedRestaurant.minOrder),
      deliveryRadius: Number(updatedRestaurant.deliveryRadius),
      estimatedDeliveryTime: Number(updatedRestaurant.estimatedDeliveryTime)
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      data: restaurantData
    })

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    
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
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
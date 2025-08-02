import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { buildThemeTokens, validateColorPair, type ThemeColors } from '@/lib/color/theme-builder'

// Schema de validação para tema
const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária deve ser um HEX válido'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária deve ser um HEX válido'),
  destructiveColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor destrutiva deve ser um HEX válido').optional(),
  warningColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor de aviso deve ser um HEX válido').optional()
})

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

// GET /api/admin/theme - Buscar tema atual do restaurante
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    // Montar configuração do tema atual
    const currentTheme: ThemeColors = {
      primary: restaurant.primaryColor || '#3B82F6',
      secondary: restaurant.secondaryColor || '#10B981',
      destructive: restaurant.destructiveColor || '#EF4444',
      warning: restaurant.warningColor || '#F59E0B'
    }

    // Gerar tokens completos do tema
    const themeTokens = buildThemeTokens(currentTheme)

    return NextResponse.json({
      success: true,
      data: {
        colors: currentTheme,
        tokens: themeTokens,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar tema:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/theme - Salvar novo tema
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = themeSchema.parse(body)

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    // Validar contraste entre cores primária e secundária
    const contrastResult = validateColorPair(validatedData.primaryColor, validatedData.secondaryColor)
    
    if (!contrastResult.isValid) {
      return NextResponse.json(
        { 
          error: 'Contraste insuficiente entre cores primária e secundária',
          details: {
            contrast: contrastResult.contrast,
            level: contrastResult.level,
            recommendation: 'Escolha cores com maior contraste para melhor acessibilidade'
          }
        },
        { status: 400 }
      )
    }

    // Montar configuração do tema
    const themeColors: ThemeColors = {
      primary: validatedData.primaryColor,
      secondary: validatedData.secondaryColor,
      destructive: validatedData.destructiveColor,
      warning: validatedData.warningColor
    }

    // Gerar tokens completos do tema para validação
    const themeTokens = buildThemeTokens(themeColors)

    // Verificar se o tema passa na auditoria de contraste
    if (themeTokens.summary.passRate < 70) {
      return NextResponse.json(
        { 
          error: 'Tema não atende aos requisitos de acessibilidade',
          details: {
            passRate: themeTokens.summary.passRate,
            failing: themeTokens.summary.failing,
            total: themeTokens.summary.total,
            recommendation: 'Ajuste as cores para melhorar o contraste'
          }
        },
        { status: 400 }
      )
    }

    // Salvar tema no banco de dados
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        primaryColor: validatedData.primaryColor,
        secondaryColor: validatedData.secondaryColor,
        destructiveColor: validatedData.destructiveColor,
        warningColor: validatedData.warningColor,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tema salvo com sucesso',
      data: {
        colors: themeColors,
        tokens: themeTokens,
        contrast: {
          passRate: themeTokens.summary.passRate,
          level: contrastResult.level,
          passing: themeTokens.summary.passing,
          failing: themeTokens.summary.failing
        },
        restaurant: {
          id: updatedRestaurant.id,
          name: updatedRestaurant.name,
          slug: updatedRestaurant.slug
        }
      }
    })

  } catch (error) {
    console.error('Erro ao salvar tema:', error)
    
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

// PUT /api/admin/theme/preview - Preview do tema sem salvar
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = themeSchema.parse(body)

    await validateRestaurantAccess(authUser.profileId)

    // Montar configuração do tema
    const themeColors: ThemeColors = {
      primary: validatedData.primaryColor,
      secondary: validatedData.secondaryColor,
      destructive: validatedData.destructiveColor,
      warning: validatedData.warningColor
    }

    // Gerar tokens completos do tema
    const themeTokens = buildThemeTokens(themeColors)

    // Validar contraste entre cores primária e secundária
    const contrastResult = validateColorPair(validatedData.primaryColor, validatedData.secondaryColor)

    return NextResponse.json({
      success: true,
      data: {
        colors: themeColors,
        tokens: themeTokens,
        contrast: {
          isValid: contrastResult.isValid,
          contrast: contrastResult.contrast,
          level: contrastResult.level,
          passRate: themeTokens.summary.passRate,
          passing: themeTokens.summary.passing,
          failing: themeTokens.summary.failing,
          total: themeTokens.summary.total
        },
        recommendations: {
          accessibility: themeTokens.summary.passRate >= 70 ? 'Ótimo' : 'Melhorar contraste',
          contrast: contrastResult.level,
          readiness: themeTokens.summary.passRate >= 70 && contrastResult.isValid ? 'Pronto para usar' : 'Ajustes necessários'
        }
      }
    })

  } catch (error) {
    console.error('Erro ao gerar preview do tema:', error)
    
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
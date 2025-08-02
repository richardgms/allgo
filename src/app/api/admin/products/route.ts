import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para validação de opções de variação
const variationOptionSchema = z.object({
  id: z.string().optional(), // Para updates
  name: z.string().min(1, 'Nome da opção é obrigatório'),
  priceChange: z.number(),
  isAvailable: z.boolean().default(true)
})

// Schema para validação de grupos de variação
const variationGroupSchema = z.object({
  id: z.string().optional(), // Para updates
  name: z.string().min(1, 'Nome do grupo é obrigatório'),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
  maxSelections: z.number().optional(),
  options: z.array(variationOptionSchema)
})

// Schema de validação para produtos
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: z.string().url('URL da imagem inválida').optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  preparationTime: z.number().min(0).optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  nutritionalInfo: z.string().optional(),
  variationGroups: z.array(variationGroupSchema).optional()
})

async function validateRestaurantAccess(userProfileId: string, categoryId?: string) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: userProfileId },
    include: { restaurant: true }
  })

  if (!userProfile?.restaurant) {
    throw new Error('Restaurante não encontrado')
  }

  // Se categoryId foi fornecida, verificar se pertence ao restaurante
  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        restaurantId: userProfile.restaurant.id
      }
    })

    if (!category) {
      throw new Error('Categoria não encontrada ou não pertence ao restaurante')
    }
  }

  return userProfile.restaurant
}

// GET /api/admin/products - Listar produtos do restaurante
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const isAvailable = searchParams.get('isAvailable')
    const isFeatured = searchParams.get('isFeatured')

    const products = await prisma.product.findMany({
      where: {
        restaurantId: restaurant.id,
        ...(categoryId && { categoryId }),
        ...(isAvailable !== null && { isAvailable: isAvailable === 'true' }),
        ...(isFeatured !== null && { isFeatured: isFeatured === 'true' })
      },
      include: {
        category: true,
        variationGroups: {
          include: {
            options: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { name: 'asc' }
      ]
    })

    // Converter Decimal para number para serialização
    const productsData = products.map(product => ({
      ...product,
      price: Number(product.price),
      variationGroups: product.variationGroups.map(group => ({
        ...group,
        options: group.options.map(option => ({
          ...option,
          priceChange: Number(option.priceChange)
        }))
      }))
    }))

    return NextResponse.json({
      success: true,
      data: productsData
    })

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = productSchema.parse(body)

    const restaurant = await validateRestaurantAccess(authUser.profileId, validatedData.categoryId)

    // Criar produto usando transação para garantir integridade
    const newProduct = await prisma.$transaction(async (tx) => {
      // Criar o produto
      const product = await tx.product.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          categoryId: validatedData.categoryId,
          restaurantId: restaurant.id,
          imageUrl: validatedData.imageUrl,
          isAvailable: validatedData.isAvailable,
          isFeatured: validatedData.isFeatured,
          preparationTime: validatedData.preparationTime,
          ingredients: validatedData.ingredients,
          allergens: validatedData.allergens,
          nutritionalInfo: validatedData.nutritionalInfo
        }
      })

      // Criar grupos de variação se fornecidos
      if (validatedData.variationGroups && validatedData.variationGroups.length > 0) {
        for (const groupData of validatedData.variationGroups) {
          const group = await tx.variationGroup.create({
            data: {
              name: groupData.name,
              required: groupData.required,
              multiple: groupData.multiple,
              maxSelections: groupData.maxSelections,
              productId: product.id
            }
          })

          // Criar opções do grupo
          if (groupData.options && groupData.options.length > 0) {
            await tx.variationOption.createMany({
              data: groupData.options.map(option => ({
                name: option.name,
                priceChange: option.priceChange,
                isAvailable: option.isAvailable,
                variationGroupId: group.id
              }))
            })
          }
        }
      }

      // Retornar produto com relações
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          variationGroups: {
            include: {
              options: true
            }
          }
        }
      })
    })

    // Converter Decimal para number para resposta
    const productData = {
      ...newProduct!,
      price: Number(newProduct!.price),
      variationGroups: newProduct!.variationGroups.map(group => ({
        ...group,
        options: group.options.map(option => ({
          ...option,
          priceChange: Number(option.priceChange)
        }))
      }))
    }

    return NextResponse.json({
      success: true,
      message: 'Produto criado com sucesso',
      data: productData
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
    
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
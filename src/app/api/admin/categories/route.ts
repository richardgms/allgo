import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para categorias
const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0, 'Ordem deve ser positiva').optional()
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

// GET /api/admin/categories - Listar categorias do restaurante
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const categories = await prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
        ...(isActive !== null && { isActive: isActive === 'true' })
      },
      include: {
        ...(includeProducts && {
          products: {
            where: { isAvailable: true },
            orderBy: [
              { isFeatured: 'desc' },
              { name: 'asc' }
            ]
          }
        }),
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    // Converter Decimal para number para serialização se incluir produtos
    const categoriesData = categories.map(category => ({
      ...category,
      ...(includeProducts && category.products && {
        products: category.products.map(product => ({
          ...product,
          price: Number(product.price)
        }))
      })
    }))

    return NextResponse.json({
      success: true,
      data: categoriesData
    })

  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    // Verificar se já existe categoria com o mesmo nome
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        restaurantId: restaurant.id
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 400 }
      )
    }

    // Definir sortOrder se não fornecido
    let sortOrder = validatedData.sortOrder
    if (sortOrder === undefined) {
      const lastCategory = await prisma.category.findFirst({
        where: { restaurantId: restaurant.id },
        orderBy: { sortOrder: 'desc' }
      })
      sortOrder = (lastCategory?.sortOrder || 0) + 1
    }

    const newCategory = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        isActive: validatedData.isActive,
        sortOrder,
        restaurantId: restaurant.id
      },
      include: {
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: newCategory
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    
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

// PUT /api/admin/categories/reorder - Reordenar categorias
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const restaurant = await validateRestaurantAccess(authUser.profileId)

    const body = await request.json()
    const reorderSchema = z.object({
      categoryIds: z.array(z.string()).min(1, 'Lista de categorias é obrigatória')
    })
    
    const { categoryIds } = reorderSchema.parse(body)

    // Verificar se todas as categorias pertencem ao restaurante
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        restaurantId: restaurant.id
      }
    })

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: 'Uma ou mais categorias não pertencem ao restaurante' },
        { status: 400 }
      )
    }

    // Atualizar ordem usando transação
    await prisma.$transaction(
      categoryIds.map((categoryId, index) =>
        prisma.category.update({
          where: { id: categoryId },
          data: { sortOrder: index + 1 }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Categorias reordenadas com sucesso'
    })

  } catch (error) {
    console.error('Erro ao reordenar categorias:', error)
    
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
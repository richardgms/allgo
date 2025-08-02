import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para update de categorias
const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo').optional(),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().min(0, 'Ordem deve ser positiva').optional()
})

async function validateCategoryAccess(userProfileId: string, categoryId: string) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: userProfileId },
    include: { restaurant: true }
  })

  if (!userProfile?.restaurant) {
    throw new Error('Restaurante não encontrado')
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId: userProfile.restaurant.id
    },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  })

  if (!category) {
    throw new Error('Categoria não encontrada ou não pertence ao restaurante')
  }

  return { restaurant: userProfile.restaurant, category }
}

interface CategoryRouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/admin/categories/[id] - Buscar categoria específica
export async function GET(request: NextRequest, { params }: CategoryRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { category } = await validateCategoryAccess(authUser.profileId, id)

    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    let categoryData = category

    if (includeProducts) {
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            where: { isAvailable: true },
            include: {
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
          },
          _count: {
            select: {
              products: {
                where: { isAvailable: true }
              }
            }
          }
        }
      })

      // Converter Decimal para number para serialização
      categoryData = {
        ...categoryWithProducts!,
        products: categoryWithProducts!.products.map(product => ({
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
      }
    }

    return NextResponse.json({
      success: true,
      data: categoryData
    })

  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('não encontrada') ? 404 : 500 }
    )
  }
}

// PUT /api/admin/categories/[id] - Atualizar categoria
export async function PUT(request: NextRequest, { params }: CategoryRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const { restaurant, category } = await validateCategoryAccess(authUser.profileId, id)

    // Verificar se o novo nome já existe (se fornecido)
    if (validatedData.name && validatedData.name !== category.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          restaurantId: restaurant.id,
          id: { not: id }
        }
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Já existe uma categoria com este nome' },
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
        ...(validatedData.sortOrder !== undefined && { sortOrder: validatedData.sortOrder }),
        updatedAt: new Date()
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
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory
    })

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    
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
      { status: error instanceof Error && error.message.includes('não encontrada') ? 404 : 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Deletar categoria
export async function DELETE(request: NextRequest, { params }: CategoryRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { category } = await validateCategoryAccess(authUser.profileId, id)

    // Verificar se categoria tem produtos
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar categoria que possui produtos. Mova os produtos para outra categoria primeiro.' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Categoria deletada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar categoria:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('não encontrada') ? 404 : 500 }
    )
  }
}
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

// Schema de validação para update de produtos
const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo').optional(),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  price: z.number().min(0, 'Preço deve ser positivo').optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória').optional(),
  imageUrl: z.string().url('URL da imagem inválida').optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  preparationTime: z.number().min(0).optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  nutritionalInfo: z.string().optional(),
  variationGroups: z.array(variationGroupSchema).optional()
})

async function validateProductAccess(userProfileId: string, productId: string) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: userProfileId },
    include: { restaurant: true }
  })

  if (!userProfile?.restaurant) {
    throw new Error('Restaurante não encontrado')
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      restaurantId: userProfile.restaurant.id
    },
    include: {
      category: true,
      variationGroups: {
        include: {
          options: true
        }
      }
    }
  })

  if (!product) {
    throw new Error('Produto não encontrado ou não pertence ao restaurante')
  }

  return { restaurant: userProfile.restaurant, product }
}

interface ProductRouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/admin/products/[id] - Buscar produto específico
export async function GET(request: NextRequest, { params }: ProductRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { product } = await validateProductAccess(authUser.profileId, id)

    // Converter Decimal para number para serialização
    const productData = {
      ...product,
      price: Number(product.price),
      variationGroups: product.variationGroups.map(group => ({
        ...group,
        options: group.options.map(option => ({
          ...option,
          priceChange: Number(option.priceChange)
        }))
      }))
    }

    return NextResponse.json({
      success: true,
      data: productData
    })

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('não encontrado') ? 404 : 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Atualizar produto
export async function PUT(request: NextRequest, { params }: ProductRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const { restaurant, product } = await validateProductAccess(authUser.profileId, id)

    // Verificar se categoria pertence ao restaurante (se fornecida)
    if (validatedData.categoryId && validatedData.categoryId !== product.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: validatedData.categoryId,
          restaurantId: restaurant.id
        }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada ou não pertence ao restaurante' },
          { status: 400 }
        )
      }
    }

    // Atualizar produto usando transação
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Atualizar produto
      const product = await tx.product.update({
        where: { id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.description !== undefined && { description: validatedData.description }),
          ...(validatedData.price && { price: validatedData.price }),
          ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
          ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl }),
          ...(validatedData.isAvailable !== undefined && { isAvailable: validatedData.isAvailable }),
          ...(validatedData.isFeatured !== undefined && { isFeatured: validatedData.isFeatured }),
          ...(validatedData.preparationTime !== undefined && { preparationTime: validatedData.preparationTime }),
          ...(validatedData.ingredients !== undefined && { ingredients: validatedData.ingredients }),
          ...(validatedData.allergens !== undefined && { allergens: validatedData.allergens }),
          ...(validatedData.nutritionalInfo !== undefined && { nutritionalInfo: validatedData.nutritionalInfo }),
          updatedAt: new Date()
        }
      })

      // Atualizar grupos de variação se fornecidos
      if (validatedData.variationGroups) {
        // Remover grupos existentes
        await tx.variationOption.deleteMany({
          where: {
            variationGroup: {
              productId: id
            }
          }
        })
        await tx.variationGroup.deleteMany({
          where: { productId: id }
        })

        // Criar novos grupos
        for (const groupData of validatedData.variationGroups) {
          const group = await tx.variationGroup.create({
            data: {
              name: groupData.name,
              required: groupData.required,
              multiple: groupData.multiple,
              maxSelections: groupData.maxSelections,
              productId: id
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

      // Retornar produto atualizado com relações
      return await tx.product.findUnique({
        where: { id },
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
      ...updatedProduct!,
      price: Number(updatedProduct!.price),
      variationGroups: updatedProduct!.variationGroups.map(group => ({
        ...group,
        options: group.options.map(option => ({
          ...option,
          priceChange: Number(option.priceChange)
        }))
      }))
    }

    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: productData
    })

  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    
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
      { status: error instanceof Error && error.message.includes('não encontrado') ? 404 : 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Deletar produto
export async function DELETE(request: NextRequest, { params }: ProductRouteParams) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    await validateProductAccess(authUser.profileId, id)

    // Verificar se produto tem pedidos associados
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id }
    })

    if (orderItems) {
      return NextResponse.json(
        { error: 'Não é possível deletar produto que já foi pedido. Desative-o em vez disso.' },
        { status: 400 }
      )
    }

    // Deletar produto e relações em cascata
    await prisma.$transaction(async (tx) => {
      // Deletar opções de variação
      await tx.variationOption.deleteMany({
        where: {
          variationGroup: {
            productId: id
          }
        }
      })

      // Deletar grupos de variação
      await tx.variationGroup.deleteMany({
        where: { productId: id }
      })

      // Deletar produto
      await tx.product.delete({
        where: { id }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Produto deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('não encontrado') ? 404 : 500 }
    )
  }
}
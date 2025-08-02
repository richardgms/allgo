import { prisma } from '@/lib/prisma'

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Clean existing data
    await prisma.orderItemOption.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.variationOption.deleteMany()
    await prisma.variationGroup.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.profile.deleteMany()

    // Create a sample profile
    const profile = await prisma.profile.create({
      data: {
        email: 'dono@pizzariaexemplo.com',
        name: 'João Silva'
      }
    })

    console.log('✅ Profile criado:', profile.email)

    // Create a sample restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        slug: 'pizzaria-exemplo',
        name: 'Pizzaria Exemplo',
        description: 'A melhor pizzaria da região com massa artesanal e ingredientes frescos',
        phone: '(11) 3333-3333',
        email: 'contato@pizzariaexemplo.com',
        address: 'Rua das Pizzas, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        ownerId: profile.id,
        primaryColor: '#E53E3E',
        secondaryColor: '#38A169',
        pixKey: 'dono@pizzariaexemplo.com',
        pixKeyType: 'EMAIL',
        deliveryFee: 5.00,
        minOrder: 25.00
      }
    })

    console.log('✅ Restaurante criado:', restaurant.name)

    // Create categories
    const pizzasTradicionais = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Pizzas Tradicionais',
        description: 'Nossas pizzas clássicas mais pedidas',
        sortOrder: 0
      }
    })

    const pizzasEspeciais = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Pizzas Especiais',
        description: 'Criações exclusivas da casa',
        sortOrder: 1
      }
    })

    const bebidas = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Bebidas',
        description: 'Refrigerantes, sucos e águas',
        sortOrder: 2
      }
    })

    console.log('✅ Categorias criadas')

    // Create products - Pizzas Tradicionais
    const margherita = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: pizzasTradicionais.id,
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
        price: 32.90,
        isFeatured: true,
        sortOrder: 0
      }
    })

    const pepperoni = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: pizzasTradicionais.id,
        name: 'Pizza Pepperoni',
        description: 'Molho de tomate, mussarela e pepperoni',
        price: 36.90,
        sortOrder: 1
      }
    })

    const portuguesa = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: pizzasTradicionais.id,
        name: 'Pizza Portuguesa',
        description: 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona',
        price: 38.90,
        sortOrder: 2
      }
    })

    // Create products - Pizzas Especiais
    const doChef = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: pizzasEspeciais.id,
        name: 'Pizza do Chef',
        description: 'Molho de tomate, mussarela, salmão defumado, rúcula e alcaparras',
        price: 45.90,
        isFeatured: true,
        sortOrder: 0
      }
    })

    // Create products - Bebidas
    const cocaCola = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: bebidas.id,
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante gelado',
        price: 4.50,
        sortOrder: 0
      }
    })

    const agua = await prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: bebidas.id,
        name: 'Água Mineral 500ml',
        description: 'Água mineral sem gás',
        price: 2.50,
        sortOrder: 1
      }
    })

    console.log('✅ Produtos criados')

    // Create variation groups for pizzas
    const pizzaProducts = [margherita, pepperoni, portuguesa, doChef]

    for (const pizza of pizzaProducts) {
      // Tamanho - Required variation
      const tamanhoGroup = await prisma.variationGroup.create({
        data: {
          productId: pizza.id,
          name: 'Tamanho',
          required: true,
          multiple: false,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 0
        }
      })

      // Tamanho options
      await prisma.variationOption.create({
        data: {
          variationGroupId: tamanhoGroup.id,
          name: 'Pequena (25cm)',
          priceChange: -5.00,
          isDefault: false,
          sortOrder: 0
        }
      })

      await prisma.variationOption.create({
        data: {
          variationGroupId: tamanhoGroup.id,
          name: 'Média (30cm)',
          priceChange: 0,
          isDefault: true,
          sortOrder: 1
        }
      })

      await prisma.variationOption.create({
        data: {
          variationGroupId: tamanhoGroup.id,
          name: 'Grande (35cm)',
          priceChange: 8.00,
          isDefault: false,
          sortOrder: 2
        }
      })

      // Borda - Optional variation
      const bordaGroup = await prisma.variationGroup.create({
        data: {
          productId: pizza.id,
          name: 'Borda',
          required: false,
          multiple: false,
          minSelections: 0,
          maxSelections: 1,
          sortOrder: 1
        }
      })

      // Borda options
      await prisma.variationOption.create({
        data: {
          variationGroupId: bordaGroup.id,
          name: 'Sem borda recheada',
          priceChange: 0,
          isDefault: true,
          sortOrder: 0
        }
      })

      await prisma.variationOption.create({
        data: {
          variationGroupId: bordaGroup.id,
          name: 'Borda de catupiry',
          priceChange: 6.00,
          isDefault: false,
          sortOrder: 1
        }
      })

      await prisma.variationOption.create({
        data: {
          variationGroupId: bordaGroup.id,
          name: 'Borda de cheddar',
          priceChange: 7.00,
          isDefault: false,
          sortOrder: 2
        }
      })
    }

    console.log('✅ Grupos de variações criados para pizzas')

    // Create a sample order
    const order = await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        orderNumber: 'ORD-001',
        customerName: 'Maria Santos',
        customerPhone: '(11) 98888-8888',
        customerEmail: 'maria@email.com',
        deliveryAddress: 'Rua dos Clientes, 456, Apto 12',
        deliveryMethod: 'DELIVERY',
        paymentMethod: 'PIX',
        paymentStatus: 'PENDING',
        subtotal: 32.90,
        deliveryFee: 5.00,
        total: 37.90,
        status: 'PENDING'
      }
    })

    // Create order item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: margherita.id,
        quantity: 1,
        unitPrice: 32.90,
        totalPrice: 32.90,
        notes: 'Pizza bem assada, por favor'
      }
    })

    console.log('✅ Pedido de exemplo criado')

    console.log('\n🎉 Seed concluído com sucesso!')
    console.log(`\n📍 Acesse: http://localhost:3000/${restaurant.slug}`)
    console.log(`🔑 Login: ${profile.email}`)
    console.log(`🔑 Senha: HackeaDeNovoBuceta (senha temporária para testes)`)
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run seed
seed()
import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RestaurantMenu from '@/components/restaurant/restaurant-menu'

interface RestaurantPageProps {
  params: {
    slug: string
  }
}

async function getRestaurantWithMenu(slug: string) {
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    return null
  }

  // Get menu with categories and products
  const categories = await prisma.category.findMany({
    where: {
      restaurantId: restaurant.id,
      isActive: true
    },
    include: {
      products: {
        where: {
          isActive: true
        },
        include: {
          variationGroups: {
            include: {
              options: {
                where: {
                  isActive: true
                },
                orderBy: {
                  sortOrder: 'asc'
                }
              }
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        },
        orderBy: {
          sortOrder: 'asc'
        }
      }
    },
    orderBy: {
      sortOrder: 'asc'
    }
  })

  return {
    restaurant,
    categories
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  const data = await getRestaurantWithMenu(slug)
  
  if (!data) {
    notFound()
  }

  const { restaurant, categories } = data

  // Convert Decimal fields to numbers for client components
  const restaurantForClient = {
    ...restaurant,
    deliveryFee: Number(restaurant.deliveryFee),
    minOrder: Number(restaurant.minOrder)
  }

  const categoriesForClient = categories.map(category => ({
    ...category,
    products: category.products.map(product => ({
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
  }))

  return (
    <div className="min-h-screen">
      <RestaurantMenu 
        restaurant={restaurantForClient}
        categories={categoriesForClient}
      />
    </div>
  )
}

export async function generateMetadata({ params }: RestaurantPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    return {
      title: 'Restaurante não encontrado',
    }
  }

  return {
    title: `${restaurant.name} - Delivery`,
    description: restaurant.description || `Faça seu pedido no ${restaurant.name}`,
  }
}
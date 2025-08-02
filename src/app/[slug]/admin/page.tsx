import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  Menu, 
  TrendingUp, 
  Clock,
  CheckCircle
} from 'lucide-react'

interface AdminDashboardProps {
  params: Promise<{
    slug: string
  }>
}

async function getDashboardData(restaurantId: string) {
  // Get dashboard statistics
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    todayOrders,
    confirmedOrders
  ] = await Promise.all([
    prisma.product.count({
      where: { restaurantId, isActive: true }
    }),
    prisma.category.count({
      where: { restaurantId, isActive: true }
    }),
    prisma.order.count({
      where: { restaurantId }
    }),
    prisma.order.count({
      where: { 
        restaurantId,
        status: 'PENDING'
      }
    }),
    prisma.order.count({
      where: {
        restaurantId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.order.count({
      where: {
        restaurantId,
        status: 'CONFIRMED'
      }
    })
  ])

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    todayOrders,
    confirmedOrders
  }
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const stats = await getDashboardData(restaurant.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo ao Dashboard
        </h1>
        <p className="text-muted-foreground">
          Gerencie seu restaurante {restaurant.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos de hoje: {stats.todayOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Em {stats.totalCategories} categorias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Confirmados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Prontos para preparo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Menu className="w-5 h-5 mr-2" />
              Gerenciar Cardápio
            </CardTitle>
            <CardDescription>
              Adicione ou edite categorias e produtos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/${restaurant.slug}/admin/menu`}>
                  Ver Cardápio
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${restaurant.slug}/admin/products`}>
                  Gerenciar Produtos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Pedidos
            </CardTitle>
            <CardDescription>
              Gerencie pedidos pendentes e histórico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/${restaurant.slug}/admin/orders`}>
                  Ver Pedidos
                </Link>
              </Button>
              {stats.pendingOrders > 0 && (
                <Badge variant="destructive" className="w-full justify-center">
                  {stats.pendingOrders} pedidos pendentes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analytics
            </CardTitle>
            <CardDescription>
              Veja estatísticas e relatórios de vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${restaurant.slug}/admin/analytics`}>
                Ver Relatórios
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Primeiros Passos</CardTitle>
          <CardDescription>
            Configure seu restaurante para começar a receber pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Configure seu cardápio</h4>
              <p className="text-sm text-muted-foreground">
                Adicione categorias e produtos ao seu cardápio
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${restaurant.slug}/admin/menu`}>
                  Configurar Cardápio
                </Link>
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Personalize seu tema</h4>
              <p className="text-sm text-muted-foreground">
                Escolha as cores da sua marca
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${restaurant.slug}/admin/theme`}>
                  Personalizar Tema
                </Link>
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Configure PIX</h4>
              <p className="text-sm text-muted-foreground">
                Adicione suas informações de pagamento
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${restaurant.slug}/admin/settings`}>
                  Configurar PIX
                </Link>
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">4. Gere seu QR Code</h4>
              <p className="text-sm text-muted-foreground">
                Imprima e cole na sua mesa ou balcão
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${restaurant.slug}/admin/qrcode`}>
                  Gerar QR Code
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
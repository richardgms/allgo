import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Download,
  Calendar,
  Package,
  Star
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AnalyticsPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getAnalyticsData(restaurantId: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = subDays(today, 1)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subDays(monthStart, 1))
  const lastMonthEnd = endOfMonth(subDays(monthStart, 1))

  const [
    todayStats,
    yesterdayStats,
    monthStats,
    lastMonthStats,
    topProducts,
    recentOrders,
    totalProducts
  ] = await Promise.all([
    // Hoje
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: { gte: today }
      },
      _count: true,
      _sum: { total: true },
      _avg: { total: true }
    }),
    // Ontem
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: { gte: yesterday, lt: today }
      },
      _count: true,
      _sum: { total: true }
    }),
    // Este mês
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: { gte: monthStart, lte: monthEnd }
      },
      _count: true,
      _sum: { total: true }
    }),
    // Mês passado
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
      },
      _count: true,
      _sum: { total: true }
    }),
    // Produtos mais vendidos
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          restaurantId,
          createdAt: { gte: monthStart }
        }
      },
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }),
    // Pedidos recentes
    prisma.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true
      }
    }),
    // Total de produtos
    prisma.product.count({
      where: { restaurantId, isActive: true }
    })
  ])

  // Buscar dados dos produtos mais vendidos
  const productIds = topProducts.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true }
  })

  const topProductsWithNames = topProducts.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      ...item,
      name: product?.name || 'Produto não encontrado',
      price: product?.price || 0
    }
  })

  return {
    todayStats,
    yesterdayStats,
    monthStats,
    lastMonthStats,
    topProducts: topProductsWithNames,
    recentOrders,
    totalProducts
  }
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const analytics = await getAnalyticsData(restaurant.id)

  // Cálculos de crescimento
  const ordersGrowth = analytics.yesterdayStats._count > 0 
    ? ((analytics.todayStats._count - analytics.yesterdayStats._count) / analytics.yesterdayStats._count) * 100
    : 0

  const revenueGrowth = analytics.yesterdayStats._sum.total && Number(analytics.yesterdayStats._sum.total) > 0
    ? ((Number(analytics.todayStats._sum.total || 0) - Number(analytics.yesterdayStats._sum.total || 0)) / Number(analytics.yesterdayStats._sum.total)) * 100
    : 0

  const monthOrdersGrowth = analytics.lastMonthStats._count > 0
    ? ((analytics.monthStats._count - analytics.lastMonthStats._count) / analytics.lastMonthStats._count) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho do seu restaurante
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Hoje vs Ontem */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.todayStats._count}</div>
            <div className="flex items-center text-xs">
              {ordersGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={ordersGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(ordersGrowth).toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {Number(analytics.todayStats._sum.total || 0).toFixed(2).replace('.', ',')}
            </div>
            <div className="flex items-center text-xs">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(revenueGrowth).toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {Number(analytics.todayStats._avg.total || 0).toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio por pedido
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
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              No cardápio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Este Mês</CardTitle>
            <CardDescription>
              {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pedidos:</span>
              <span className="font-medium">{analytics.monthStats._count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Faturamento:</span>
              <span className="font-medium">
                R$ {Number(analytics.monthStats._sum.total || 0).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs">vs mês anterior</span>
              <div className="flex items-center">
                {monthOrdersGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${monthOrdersGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {Math.abs(monthOrdersGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mês Passado</CardTitle>
            <CardDescription>
              {format(subDays(new Date(), 30), 'MMMM yyyy', { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pedidos:</span>
              <span className="font-medium">{analytics.lastMonthStats._count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Faturamento:</span>
              <span className="font-medium">
                R$ {Number(analytics.lastMonthStats._sum.total || 0).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Economia vs iFood</CardTitle>
            <CardDescription>
              Economia estimada com comissões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              R$ {(Number(analytics.monthStats._sum.total || 0) * 0.27).toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground">
              Economizados este mês (27% de comissão)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Produtos Mais Vendidos e Pedidos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top 5 Produtos
            </CardTitle>
            <CardDescription>
              Produtos mais vendidos este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topProducts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Nenhuma venda este mês</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.topProducts.map((item, index) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {Number(item.price).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item._sum.quantity}</p>
                      <p className="text-xs text-muted-foreground">vendidos</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>
              Últimos 10 pedidos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentOrders.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Nenhum pedido ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        R$ {Number(order.total).toFixed(2).replace('.', ',')}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {order.status === 'PENDING' && 'Pendente'}
                        {order.status === 'CONFIRMED' && 'Confirmado'}
                        {order.status === 'PREPARING' && 'Preparando'}
                        {order.status === 'READY' && 'Pronto'}
                        {order.status === 'DELIVERED' && 'Entregue'}
                        {order.status === 'CANCELLED' && 'Cancelado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
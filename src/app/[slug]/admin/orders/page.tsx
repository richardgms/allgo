import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  MessageCircle,
  Eye,
  Phone,
  MapPin,
  DollarSign
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OrdersPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getOrdersData(restaurantId: string) {
  const [orders, todayStats] = await Promise.all([
    prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Últimos 50 pedidos
    }),
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      _count: true,
      _sum: {
        total: true
      }
    })
  ])

  return { orders, todayStats }
}

const statusConfig = {
  PENDING: { 
    label: 'Aguardando Confirmação', 
    color: 'bg-yellow-500', 
    icon: Clock,
    description: 'Pedidos aguardando confirmação'
  },
  CONFIRMED: { 
    label: 'Confirmado', 
    color: 'bg-blue-500', 
    icon: CheckCircle,
    description: 'Pedidos confirmados e em preparo'
  },
  PREPARING: { 
    label: 'Preparando', 
    color: 'bg-orange-500', 
    icon: ShoppingCart,
    description: 'Pedidos sendo preparados'
  },
  READY: { 
    label: 'Pronto', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    description: 'Pedidos prontos para entrega'
  },
  OUT_FOR_DELIVERY: { 
    label: 'Saiu para Entrega', 
    color: 'bg-purple-500', 
    icon: Truck,
    description: 'Pedidos em rota de entrega'
  },
  DELIVERED: { 
    label: 'Entregue', 
    color: 'bg-green-600', 
    icon: CheckCircle,
    description: 'Pedidos entregues com sucesso'
  },
  CANCELLED: { 
    label: 'Cancelado', 
    color: 'bg-red-500', 
    icon: XCircle,
    description: 'Pedidos cancelados'
  }
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const { orders, todayStats } = await getOrdersData(restaurant.id)

  // Agrupar pedidos por status
  const ordersByStatus = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = []
    }
    acc[order.status].push(order)
    return acc
  }, {} as Record<string, typeof orders>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Pedidos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie todos os pedidos em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Stats do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats._count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos hoje
            </p>
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
              R$ {Number(todayStats._sum.total || 0).toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita do dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersByStatus.PENDING?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Preparo
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(ordersByStatus.CONFIRMED?.length || 0) + (ordersByStatus.PREPARING?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmados + preparando
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard de Pedidos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[600px]">
          {Object.entries(statusConfig).map(([status, config]) => {
            const statusOrders = ordersByStatus[status] || []
            const StatusIcon = config.icon
            
            return (
              <Card key={status} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <CardTitle className="text-sm font-medium">
                      {config.label}
                    </CardTitle>
                    <Badge variant="secondary">{statusOrders.length}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 pt-0">
                  <div className="space-y-3">
                    {statusOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <StatusIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Nenhum pedido</p>
                      </div>
                    ) : (
                      statusOrders.map(order => (
                        <Card key={order.id} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-sm">
                                  Pedido #{order.orderNumber}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {formatDistanceToNow(new Date(order.createdAt), { 
                                    addSuffix: true, 
                                    locale: ptBR 
                                  })}
                                </CardDescription>
                              </div>
                              <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                                {order.paymentStatus === 'PAID' ? 'Pago' : 'Pendente'}
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0 space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3" />
                                <span className="font-medium">{order.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">{order.deliveryAddress}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                {order.items.length} item(s):
                              </div>
                              {order.items.slice(0, 2).map(item => (
                                <div key={item.id} className="text-xs">
                                  {item.quantity}x {item.product.name}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{order.items.length - 2} item(s)
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-bold text-primary">
                                R$ {Number(order.total).toFixed(2).replace('.', ',')}
                              </span>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
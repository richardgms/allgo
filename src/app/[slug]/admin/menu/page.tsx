import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  GripVertical,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

interface MenuPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getMenuData(restaurantId: string) {
  const categories = await prisma.category.findMany({
    where: { restaurantId },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })

  return { categories }
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const { categories } = await getMenuData(restaurant.id)
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Cardápio
          </h1>
          <p className="text-muted-foreground">
            Organize categorias e produtos do seu cardápio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categorias
            </CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter(c => c.isActive).length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produtos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média por Categoria
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos por categoria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Cardápio</CardTitle>
          <CardDescription>
            Organize suas categorias e produtos. Arraste para reordenar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <Menu className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Cardápio vazio</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira categoria
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, categoryIndex) => (
                <Card key={category.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <Badge variant="outline">{category.products.length} produtos</Badge>
                            {category.isActive ? (
                              <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          {category.description && (
                            <CardDescription>{category.description}</CardDescription>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Produto
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {category.products.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <Package className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Nenhum produto nesta categoria</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.products.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{product.name}</span>
                                  {product.isFeatured && (
                                    <Badge variant="secondary" className="text-xs">
                                      Destaque
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                                  <span>Ordem: {product.sortOrder}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Importar Cardápio (CSV/Excel)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="w-4 h-4 mr-2" />
              Exportar Cardápio
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Menu className="w-4 h-4 mr-2" />
              Templates de Cardápio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status do Cardápio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Produtos ativos:</span>
              <span className="font-medium">{totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Categorias ativas:</span>
              <span className="font-medium">{categories.filter(c => c.isActive).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Última atualização:</span>
              <span className="font-medium text-xs text-muted-foreground">Hoje</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
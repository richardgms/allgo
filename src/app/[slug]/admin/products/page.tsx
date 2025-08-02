import { getRestaurantBySlug } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  DollarSign
} from 'lucide-react'

interface ProductsPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProductsData(restaurantId: string) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { restaurantId },
      include: {
        category: true,
        variationGroups: {
          include: {
            options: true
          }
        }
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' }
      ]
    }),
    prisma.category.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  ])

  return { products, categories }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const { products, categories } = await getProductsData(restaurant.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Produtos
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os produtos do seu cardápio
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => p.isActive).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos em Destaque
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.isFeatured).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Destacados no cardápio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Preço Médio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {products.length > 0 
                ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(2).replace('.', ',')
                : '0,00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Preço médio dos produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categorias
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Categorias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            Todos os produtos organizados por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro produto ao cardápio
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Produto
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.categoryId === category.id)
                
                if (categoryProducts.length === 0) return null

                return (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge variant="secondary">{categoryProducts.length} produtos</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryProducts.map(product => (
                        <Card key={product.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-base line-clamp-2">
                                  {product.name}
                                  {product.isFeatured && (
                                    <Star className="w-4 h-4 inline ml-2 text-yellow-500 fill-yellow-500" />
                                  )}
                                </CardTitle>
                                {product.description && (
                                  <CardDescription className="line-clamp-2 mt-1">
                                    {product.description}
                                  </CardDescription>
                                )}
                              </div>
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-primary">
                                  R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                </span>
                                {product.variationGroups.length > 0 && (
                                  <Badge variant="outline">
                                    {product.variationGroups.length} variação(ões)
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
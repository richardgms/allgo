'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, MapPin, Clock, Phone } from 'lucide-react'
import type { Restaurant, Category, Product, VariationGroup, VariationOption } from '@prisma/client'

type RestaurantWithNumbers = Omit<Restaurant, 'deliveryFee' | 'minOrder'> & {
  deliveryFee: number
  minOrder: number
}

type ProductWithNumbers = Omit<Product, 'price'> & {
  price: number
}

type VariationOptionWithNumbers = Omit<VariationOption, 'priceChange'> & {
  priceChange: number
}

type ProductWithVariations = ProductWithNumbers & {
  variationGroups: (VariationGroup & {
    options: VariationOptionWithNumbers[]
  })[]
}

type CategoryWithProducts = Category & {
  products: ProductWithVariations[]
}

interface RestaurantMenuProps {
  restaurant: RestaurantWithNumbers
  categories: CategoryWithProducts[]
}

interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  selectedOptions: { [groupId: string]: string }
  notes?: string
}

export default function RestaurantMenu({ restaurant, categories }: RestaurantMenuProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  )

  const addToCart = (product: ProductWithVariations, selectedOptions: { [groupId: string]: string }) => {
    // Calculate final price with variations
    let finalPrice = Number(product.price)
    
    product.variationGroups.forEach(group => {
      const selectedOptionId = selectedOptions[group.id]
      if (selectedOptionId) {
        const option = group.options.find(opt => opt.id === selectedOptionId)
        if (option) {
          finalPrice += Number(option.priceChange)
        }
      }
    })

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: finalPrice,
      quantity: 1,
      selectedOptions
    }

    setCart(prev => [...prev, cartItem])
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div 
      className="min-h-screen"
      style={{
        '--primary-500': restaurant.primaryColor,
        '--secondary-500': restaurant.secondaryColor,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-primary-foreground/80 text-lg mb-4">
                {restaurant.description}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {restaurant.address}, {restaurant.city}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {restaurant.phone}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Aberto agora
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Categorias</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.products.length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {categories
              .filter(category => !selectedCategory || category.id === selectedCategory)
              .map(category => (
              <div key={category.id} className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>

                {category !== categories[categories.length - 1] && (
                  <Separator className="mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button size="lg" className="rounded-full shadow-lg">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {cartItemCount} itens - R$ {cartTotal.toFixed(2).replace('.', ',')}
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: ProductWithVariations
  onAddToCart: (product: ProductWithVariations, selectedOptions: { [groupId: string]: string }) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<{ [groupId: string]: string }>({})
  
  const handleAddToCart = () => {
    // Validate required selections
    const hasAllRequired = product.variationGroups
      .filter(group => group.required)
      .every(group => selectedOptions[group.id])
    
    if (!hasAllRequired) {
      alert('Por favor, selecione todas as opções obrigatórias')
      return
    }
    
    onAddToCart(product, selectedOptions)
  }

  // Calculate display price with variations
  let displayPrice = Number(product.price)
  product.variationGroups.forEach(group => {
    const selectedOptionId = selectedOptions[group.id]
    if (selectedOptionId) {
      const option = group.options.find(opt => opt.id === selectedOptionId)
      if (option) {
        displayPrice += Number(option.priceChange)
      }
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            {product.description && (
              <CardDescription className="mt-1">
                {product.description}
              </CardDescription>
            )}
          </div>
          {product.isFeatured && (
            <Badge variant="secondary">Destaque</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Variations */}
        {product.variationGroups.map(group => (
          <div key={group.id}>
            <h4 className="font-medium mb-2">
              {group.name}
              {group.required && <span className="text-red-500 ml-1">*</span>}
            </h4>
            <div className="space-y-2">
              {group.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type={group.multiple ? 'checkbox' : 'radio'}
                    id={`${group.id}-${option.id}`}
                    name={group.id}
                    value={option.id}
                    checked={selectedOptions[group.id] === option.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOptions(prev => ({
                          ...prev,
                          [group.id]: option.id
                        }))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label 
                    htmlFor={`${group.id}-${option.id}`}
                    className="flex-1 text-sm cursor-pointer flex justify-between"
                  >
                    <span>{option.name}</span>
                    {Number(option.priceChange) !== 0 && (
                      <span className="text-muted-foreground">
                        {Number(option.priceChange) > 0 ? '+' : ''}
                        R$ {Number(option.priceChange).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-primary">
            R$ {displayPrice.toFixed(2).replace('.', ',')}
          </div>
          <Button onClick={handleAddToCart}>
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
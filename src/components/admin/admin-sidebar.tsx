'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Menu, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  Palette,
  QrCode,
  MessageCircle
} from 'lucide-react'
import type { Restaurant } from '@prisma/client'

type RestaurantWithNumbers = Omit<Restaurant, 'deliveryFee' | 'minOrder'> & {
  deliveryFee: number
  minOrder: number
}

interface AdminSidebarProps {
  restaurant: RestaurantWithNumbers
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Cardápio',
    href: '/admin/menu',
    icon: Menu
  },
  {
    title: 'Produtos',
    href: '/admin/products',
    icon: Package
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Personalização',
    href: '/admin/theme',
    icon: Palette
  },
  {
    title: 'QR Code',
    href: '/admin/qrcode',
    icon: QrCode
  },
  {
    title: 'WhatsApp',
    href: '/admin/whatsapp',
    icon: MessageCircle
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminSidebar({ restaurant }: AdminSidebarProps) {
  const pathname = usePathname()
  const baseUrl = `/${restaurant.slug}`

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <Link href={baseUrl} className="block">
          <h2 className="text-xl font-bold text-foreground truncate">
            {restaurant.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Painel Administrativo
          </p>
        </Link>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const href = `${baseUrl}${item.href}`
            const isActive = pathname === href || 
              (item.href !== '/admin' && pathname.startsWith(href))

            return (
              <li key={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                  asChild
                >
                  <Link href={href}>
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.title}
                  </Link>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href={baseUrl}>
            Ver Cardápio Público
          </Link>
        </Button>
      </div>
    </div>
  )
}
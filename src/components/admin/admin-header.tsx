'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, LogOut, User } from 'lucide-react'
import type { Restaurant } from '@prisma/client'

type RestaurantWithNumbers = Omit<Restaurant, 'deliveryFee' | 'minOrder'> & {
  deliveryFee: number
  minOrder: number
}

interface AdminHeaderProps {
  restaurant: RestaurantWithNumbers
}

export default function AdminHeader({ restaurant }: AdminHeaderProps) {
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    // Redirect to login
    window.location.href = '/login'
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Dashboard
          </h1>
          <Badge variant={restaurant.isActive ? 'default' : 'secondary'}>
            {restaurant.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
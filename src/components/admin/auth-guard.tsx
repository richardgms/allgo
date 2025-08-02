'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

interface AuthGuardProps {
  children: React.ReactNode
  restaurantSlug: string
}

export default function AuthGuard({ children, restaurantSlug }: AuthGuardProps) {
  const router = useRouter()
  const { user, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push(`/login?redirect=/${restaurantSlug}/admin`)
    }
  }, [user, hasHydrated, restaurantSlug, router])

  // Show loading while hydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show loading if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
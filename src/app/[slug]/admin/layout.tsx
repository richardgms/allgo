import { getRestaurantBySlug } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'
import AuthGuard from '@/components/admin/auth-guard'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { slug: restaurantSlug } = await params

  // Get restaurant data
  const restaurant = await getRestaurantBySlug(restaurantSlug)
  
  if (!restaurant) {
    redirect('/')
  }

  // Convert Decimal fields to numbers for client components
  const restaurantForClient = {
    ...restaurant,
    deliveryFee: Number(restaurant.deliveryFee),
    minOrder: Number(restaurant.minOrder)
  }

  return (
    <AuthGuard restaurantSlug={restaurantSlug}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar restaurant={restaurantForClient} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            <AdminHeader restaurant={restaurantForClient} />
            
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
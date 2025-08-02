import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to disconnect Prisma (useful for serverless functions)
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

// Export types for use in the application
export type {
  Profile,
  Restaurant,
  Category,
  Product,
  VariationGroup,
  VariationOption,
  Order,
  OrderItem,
  OrderItemOption,
  OrderStatus,
  DeliveryMethod,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client'
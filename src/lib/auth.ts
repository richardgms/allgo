import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

export interface JWTPayload {
  profileId: string
  email: string
  name: string
  type: 'access' | 'refresh'
}

export interface AuthUser {
  profileId: string
  email: string
  name: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT tokens
export function generateTokens(payload: Omit<JWTPayload, 'type'>) {
  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )

  return { accessToken, refreshToken }
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Get user from token in request
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload || payload.type !== 'access') {
    return null
  }

  return {
    profileId: payload.profileId,
    email: payload.email,
    name: payload.name
  }
}

// Validate restaurant access
export async function validateRestaurantAccess(
  profileId: string, 
  restaurantSlug: string
): Promise<boolean> {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        slug: restaurantSlug,
        ownerId: profileId
      }
    })

    return !!restaurant
  } catch (error) {
    console.error('Error validating restaurant access:', error)
    return false
  }
}

// Get restaurant by slug
export async function getRestaurantBySlug(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        slug: slug,
        isActive: true
      }
    })

    return restaurant
  } catch (error) {
    console.error('Error getting restaurant by slug:', error)
    return null
  }
}

// Create new profile
export async function createProfile(data: {
  email: string
  name: string
}) {
  try {
    const profile = await prisma.profile.create({
      data: {
        email: data.email,
        name: data.name
      }
    })

    return profile
  } catch (error) {
    console.error('Error creating profile:', error)
    throw new Error(`Failed to create profile: ${error}`)
  }
}

// Get profile by email
export async function getProfileByEmail(email: string) {
  try {
    console.log('Searching for profile with email:', email)
    const profile = await prisma.profile.findUnique({
      where: {
        email: email
      }
    })
    console.log('Prisma query result:', profile)

    return profile
  } catch (error) {
    console.error('Error getting profile by email:', error)
    return null
  }
}
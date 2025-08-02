import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getProfileByEmail, generateTokens } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login attempt:', { email: body.email, passwordLength: body.password?.length })
    
    const { email, password } = loginSchema.parse(body)

    // Get profile by email
    const profile = await getProfileByEmail(email)
    console.log('Profile found:', profile ? { id: profile.id, email: profile.email } : 'null')
    
    if (!profile) {
      console.log('Profile not found for email:', email)
      return NextResponse.json(
        { error: 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // For now, we'll use a simple password check (in production, use proper auth)
    // This is a simplified version for MVP - in production, implement proper password hashing
    // Test credentials: dono@pizzariaexemplo.com / HackeaDeNovoBuceta
    console.log('Password check:', { provided: password, expected: 'HackeaDeNovoBuceta', match: password === 'HackeaDeNovoBuceta' })
    
    if (password !== 'HackeaDeNovoBuceta') {
      console.log('Password mismatch')
      return NextResponse.json(
        { error: 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      profileId: profile.id,
      email: profile.email,
      name: profile.name
    })

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name
      },
      accessToken,
      refreshToken
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken, generateTokens, getProfileByEmail } from '@/lib/auth'

const refreshSchema = z.object({
  refreshToken: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = refreshSchema.parse(body)

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Token de refresh inválido', code: 'INVALID_REFRESH_TOKEN' },
        { status: 401 }
      )
    }

    // Get updated profile data
    const profile = await getProfileByEmail(payload.email)
    if (!profile) {
      return NextResponse.json(
        { error: 'Usuário não encontrado', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
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
      refreshToken: newRefreshToken
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', code: 'VALIDATION_ERROR', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
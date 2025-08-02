import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Token de acesso inválido ou expirado', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: authUser.profileId,
        email: authUser.email,
        name: authUser.name
      }
    })

  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
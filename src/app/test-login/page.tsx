'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLoginPage() {
  const [email, setEmail] = useState('dono@pizzariaexemplo.com')
  const [password, setPassword] = useState('HackeaDeNovoBuceta')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Erro desconhecido')
      }
    } catch (err) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Login - AllGoMenu</CardTitle>
          <CardDescription>
            Teste da API de autenticação com Prisma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do usuário"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
            />
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Fazendo login...' : 'Fazer Login'}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
              <strong>Erro:</strong> {error}
            </div>
          )}
          
          {result && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <strong className="text-green-800">Login bem-sucedido!</strong>
              <pre className="mt-2 text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-sm text-gray-600 border-t pt-4">
            <strong>Dados de teste:</strong><br />
            Email: dono@pizzariaexemplo.com<br />
            Senha: HackeaDeNovoBuceta<br />
            Restaurante: pizzaria-do-joao
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuthStore } from "@/stores/auth"
import { Badge } from "@/components/ui/badge"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Wait for hydration to avoid SSR mismatch
  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setError(null)

    try {
      await login(data)
      // Redirect to restaurant dashboard (using the test restaurant slug)
      router.push("/pizzaria-exemplo/admin")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro no login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="text-2xl font-bold text-primary">AllGoMenu</div>
            <Badge variant="secondary" className="mt-2">Dashboard Administrativo</Badge>
          </div>
          <CardTitle>Acesse sua conta</CardTitle>
          <CardDescription>
            Entre com suas credenciais para gerenciar seu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@restaurante.com" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <div className="mb-2">Dados para teste:</div>
            <div className="text-xs bg-muted p-2 rounded">
              <div>Email: dono@pizzariaexemplo.com</div>
              <div>Senha: HackeaDeNovoBuceta</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            Precisa de ajuda?{" "}
            <a 
              href="https://wa.me/5511999999999" 
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale conosco
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
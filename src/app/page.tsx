import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🚀 Lançamento Oficial
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            AllGoMenu
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transforme a experiência de delivery do seu restaurante com zero comissão e controle total sobre sua operação.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Começar Agora
            </Button>
            <Button variant="outline" size="lg">
              Ver Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">💰 Zero Comissão</CardTitle>
              <CardDescription className="text-center">
                Mantenha 100% da receita dos seus pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">R$ 69/mês</div>
                <div className="text-sm text-muted-foreground">57% mais barato que a concorrência</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">🎨 Controle Total</CardTitle>
              <CardDescription className="text-center">
                Personalize completamente a experiência dos seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">Sistema de Cores Avançado</Badge>
                <Badge variant="outline">Templates Premium</Badge>
                <Badge variant="outline">Sua Marca, Suas Regras</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">⚡ PIX Nativo</CardTitle>
              <CardDescription className="text-center">
                Pagamentos instantâneos sem burocracia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">QR Code Automático</Badge>
                <Badge variant="outline">Copia e Cola</Badge>
                <Badge variant="outline">Confirmação via WhatsApp</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Status do Projeto: <Badge variant="default">Em Desenvolvimento</Badge>
          </p>
          <p className="text-sm text-muted-foreground">
            Implementando com Next.js 14, TypeScript, Supabase e shadcn/ui
          </p>
        </div>
      </div>
    </div>
  )
}
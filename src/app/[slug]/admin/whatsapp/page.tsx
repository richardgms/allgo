import { getRestaurantBySlug } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  Settings, 
  Phone, 
  Send,
  Copy,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  BarChart3,
  ExternalLink,
  MessageSquare,
  Bot,
  Save
} from 'lucide-react'

interface WhatsAppPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function WhatsAppPage({ params }: WhatsAppPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const whatsappNumber = "5511999999999" // Mock data
  const isConnected = true // Mock data
  const messagesThisMonth = 127 // Mock data
  const avgResponseTime = "3 min" // Mock data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            WhatsApp
          </h1>
          <p className="text-muted-foreground">
            Configure e gerencie a integração com WhatsApp
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir WhatsApp Web
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      {/* Status da Conexão */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status da Conexão
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <Badge variant="default" className="bg-green-500">Conectado</Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <Badge variant="destructive">Desconectado</Badge>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Última verificação: agora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensagens Este Mês
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos enviados via WhatsApp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo de Resposta
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Tempo médio de resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Mensagens → Pedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuração do Número */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <CardTitle>Número do WhatsApp</CardTitle>
          </div>
          <CardDescription>
            Configure o número que receberá os pedidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
              <Input 
                id="whatsappNumber" 
                placeholder="(11) 99999-9999"
                defaultValue="(11) 99999-9999"
              />
              <p className="text-xs text-muted-foreground">
                Número com DDD que receberá os pedidos
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappFormatted">Formato Internacional</Label>
              <div className="flex gap-2">
                <Input 
                  id="whatsappFormatted" 
                  value={whatsappNumber}
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Formato usado nos links wa.me
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900">Link de Teste</h5>
                <p className="text-sm text-blue-700 mb-2">
                  Teste se o número está funcionando corretamente:
                </p>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir WhatsApp de Teste
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates de Mensagem */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <CardTitle>Templates de Mensagem</CardTitle>
          </div>
          <CardDescription>
            Personalize as mensagens enviadas automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderTemplate" className="flex items-center justify-between">
                <span>Template do Pedido</span>
                <Badge variant="outline">Padrão</Badge>
              </Label>
              <textarea 
                id="orderTemplate"
                className="w-full min-h-[120px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md mt-2"
                defaultValue={`Olá! 👋

Gostaria de fazer um pedido no *${restaurant.name}*:

{{orderItems}}

💰 *Total: {{totalAmount}}*
💳 Forma de pagamento: {{paymentMethod}}
📍 Endereço: {{deliveryAddress}}

Confirma o pedido? 😊`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variáveis como &#123;&#123;orderItems&#125;&#125;, &#123;&#123;totalAmount&#125;&#125;, &#123;&#123;paymentMethod&#125;&#125;, &#123;&#123;deliveryAddress&#125;&#125;
              </p>
            </div>

            <Separator />

            <div>
              <Label htmlFor="confirmationTemplate">Template de Confirmação</Label>
              <textarea 
                id="confirmationTemplate"
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md mt-2"
                defaultValue={`Pedido confirmado! ✅

*Pedido #{{orderNumber}}*
Tempo estimado: {{estimatedTime}}

Obrigado pela preferência! 🍕`}
              />
            </div>

            <div>
              <Label htmlFor="readyTemplate">Template - Pedido Pronto</Label>
              <textarea 
                id="readyTemplate"
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md mt-2"
                defaultValue={`Seu pedido está pronto! 🎉

*Pedido #{{orderNumber}}*
{{customerName}}, pode vir buscar ou o entregador já está a caminho!

${restaurant.address}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Testar Template
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Avançadas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Configurações Avançadas</CardTitle>
          </div>
          <CardDescription>
            Personalize o comportamento da integração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Envio Automático</h5>
                <p className="text-sm text-muted-foreground">
                  Enviar pedidos automaticamente para WhatsApp
                </p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Confirmação Manual</h5>
                <p className="text-sm text-muted-foreground">
                  Exigir confirmação antes de enviar pedido
                </p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Incluir Link do Cardápio</h5>
                <p className="text-sm text-muted-foreground">
                  Adicionar link do cardápio nas mensagens
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Notificações de Status</h5>
                <p className="text-sm text-muted-foreground">
                  Enviar atualizações automáticas do status do pedido
                </p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Integração WhatsApp Business</h4>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-900">Upgrade Disponível</h5>
                  <p className="text-sm text-green-700 mb-3">
                    Conecte sua conta WhatsApp Business para recursos avançados como:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1 mb-3">
                    <li>• Envio automático de mensagens</li>
                    <li>• Templates aprovados pelo WhatsApp</li>
                    <li>• Histórico completo de conversas</li>
                    <li>• Múltiplos atendentes</li>
                  </ul>
                  <Button variant="outline" size="sm" className="text-green-700 border-green-300">
                    Solicitar Upgrade
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagens Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Últimas Mensagens
          </CardTitle>
          <CardDescription>
            Pedidos enviados recentemente via WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pedido #00{i}</p>
                    <p className="text-xs text-muted-foreground">
                      João Silva - R$ 45,90
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Enviado
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    há {i} min
                  </p>
                </div>
              </div>
            ))}

            {/* Estado vazio */}
            {false && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nenhuma mensagem enviada ainda</p>
                <p className="text-xs">Os pedidos via WhatsApp aparecerão aqui</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
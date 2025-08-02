import { getRestaurantBySlug } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Store, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  DollarSign,
  CreditCard,
  MessageCircle,
  Bell,
  Shield,
  Save
} from 'lucide-react'

interface SettingsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do seu restaurante
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            <CardTitle>Informações Básicas</CardTitle>
          </div>
          <CardDescription>
            Dados principais do seu restaurante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Restaurante</Label>
              <Input id="name" defaultValue={restaurant.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL do Cardápio</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  allgomenu.com/
                </span>
                <Input id="slug" defaultValue={restaurant.slug} className="rounded-l-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" defaultValue={restaurant.description || ''} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input id="phone" defaultValue={restaurant.phone} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input id="email" defaultValue={restaurant.email || ''} placeholder="contato@restaurante.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <CardTitle>Endereço e Localização</CardTitle>
          </div>
          <CardDescription>
            Endereço do restaurante para entrega
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input id="address" defaultValue={restaurant.address} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" defaultValue={restaurant.city} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" defaultValue={restaurant.state} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" defaultValue={restaurant.zipCode} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operacional */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <CardTitle>Configurações Operacionais</CardTitle>
          </div>
          <CardDescription>
            Horários de funcionamento e taxas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryFee" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Taxa de Entrega (R$)
              </Label>
              <Input 
                id="deliveryFee" 
                type="number" 
                step="0.01"
                defaultValue={Number(restaurant.deliveryFee).toFixed(2)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pedido Mínimo (R$)
              </Label>
              <Input 
                id="minOrder" 
                type="number" 
                step="0.01"
                defaultValue={Number(restaurant.minOrder).toFixed(2)} 
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Horários de Funcionamento</h4>
            <p className="text-sm text-muted-foreground">
              Configure os horários de funcionamento para cada dia da semana
            </p>
            
            <div className="space-y-3">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20 text-sm">{day}</div>
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-sm text-muted-foreground">às</span>
                  <Input type="time" defaultValue="22:00" className="w-32" />
                  <Button variant="outline" size="sm">Fechado</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PIX */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Configurações PIX</CardTitle>
          </div>
          <CardDescription>
            Configure sua chave PIX para receber pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input 
                id="pixKey" 
                defaultValue={restaurant.pixKey || ''} 
                placeholder="CPF, CNPJ, email ou telefone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixKeyType">Tipo da Chave</Label>
              <Input 
                id="pixKeyType" 
                defaultValue={restaurant.pixKeyType || ''} 
                placeholder="CPF, CNPJ, EMAIL, PHONE"
              />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900">Como funciona o PIX no AllGoMenu</h5>
                <p className="text-sm text-blue-700 mt-1">
                  Configure sua chave PIX aqui e o sistema gerará automaticamente QR Codes 
                  para cada pedido. O cliente paga diretamente para você, sem taxas.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <CardTitle>Configurações WhatsApp</CardTitle>
          </div>
          <CardDescription>
            Configure a integração com WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Número do WhatsApp</Label>
            <Input 
              id="whatsapp" 
              placeholder="(11) 99999-9999" 
              defaultValue=""
            />
            <p className="text-xs text-muted-foreground">
              Número que receberá os pedidos via WhatsApp (com DDD)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappMessage">Mensagem Padrão do Pedido</Label>
            <textarea 
              id="whatsappMessage"
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
              placeholder="Olá! Gostaria de fazer um pedido..."
              defaultValue="Olá! Gostaria de fazer um pedido:

{{orderItems}}

Total: {{totalAmount}}
Forma de pagamento: {{paymentMethod}}
Endereço: {{deliveryAddress}}

Obrigado!"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personalização */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Preferências do Sistema</CardTitle>
          </div>
          <CardDescription>
            Configurações gerais da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Notificações por Email</h5>
              <p className="text-sm text-muted-foreground">
                Receber notificações de novos pedidos por email
              </p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Som de Notificação</h5>
              <p className="text-sm text-muted-foreground">
                Reproduzir som quando chegar novo pedido
              </p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">Cardápio Público Ativo</h5>
              <p className="text-sm text-muted-foreground">
                Permitir que clientes façam pedidos online
              </p>
            </div>
            <Badge variant={restaurant.isActive ? "default" : "secondary"}>
              {restaurant.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Salvar */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  )
}
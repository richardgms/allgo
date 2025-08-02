import { getRestaurantBySlug } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  QrCode, 
  Download, 
  Copy, 
  Eye,
  Printer,
  Share2,
  Smartphone,
  Monitor,
  FileText
} from 'lucide-react'

interface QRCodePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function QRCodePage({ params }: QRCodePageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)
  
  if (!restaurant) {
    notFound()
  }

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${restaurant.slug}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gerador de QR Code
          </h1>
          <p className="text-muted-foreground">
            Gere QR Codes para facilitar o acesso ao seu cardápio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos
          </Button>
        </div>
      </div>

      {/* URL do Cardápio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            URL do Seu Cardápio
          </CardTitle>
          <CardDescription>
            Este é o link que será convertido em QR Code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={menuUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>✅ URL curta e fácil de lembrar</span>
            <span>✅ Funciona em qualquer dispositivo</span>
            <span>✅ Sempre atualizado automaticamente</span>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Disponíveis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* QR Code Padrão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Code Padrão</CardTitle>
            <CardDescription>
              Ideal para impressão em papel comum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-40 h-40 bg-black opacity-10 flex items-center justify-center">
                  <QrCode className="w-24 h-24" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tamanho:</span>
                <span>256x256px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Formato:</span>
                <span>PNG, SVG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Uso:</span>
                <span>Impressão, digital</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                PNG
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                SVG
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code para Mesa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Code de Mesa</CardTitle>
            <CardDescription>
              Com bordas e texto explicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xs font-medium mb-2">{restaurant.name}</div>
                <div className="w-32 h-32 bg-black opacity-10 mx-auto mb-2 flex items-center justify-center">
                  <QrCode className="w-16 h-16" />
                </div>
                <div className="text-xs text-gray-600">
                  Escaneie para ver o cardápio
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tamanho:</span>
                <span>300x300px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inclui:</span>
                <span>Nome + instruções</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ideal para:</span>
                <span>Mesas, balcão</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                PNG
              </Button>
              <Button variant="outline" className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code para Flyer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Code para Flyer</CardTitle>
            <CardDescription>
              Alta resolução para materiais gráficos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-4 text-white text-center">
                <div className="text-sm font-bold mb-2">{restaurant.name}</div>
                <div className="w-32 h-32 bg-white mx-auto mb-2 rounded flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-black" />
                </div>
                <div className="text-xs">
                  Peça pelo app!
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tamanho:</span>
                <span>1024x1024px</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DPI:</span>
                <span>300 (impressão)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estilo:</span>
                <span>Com cores da marca</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                PNG
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Personalizado</CardTitle>
          <CardDescription>
            Crie um QR Code com suas próprias especificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamanho (px)</Label>
              <Input id="size" type="number" defaultValue="256" min="128" max="1024" step="32" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Margem (px)</Label>
              <Input id="margin" type="number" defaultValue="20" min="0" max="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Qualidade</Label>
              <select className="w-full px-3 py-2 border border-input bg-background rounded-md">
                <option value="L">Baixa (7%)</option>
                <option value="M" selected>Média (15%)</option>
                <option value="Q">Alta (25%)</option>
                <option value="H">Muito Alta (30%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Incluir texto explicativo</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Nome do restaurante</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">"Escaneie para ver o cardápio"</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">URL do cardápio</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estilo visual</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="style" value="simple" defaultChecked />
                  <span className="text-sm">Simples (preto e branco)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="style" value="branded" />
                  <span className="text-sm">Com cores da marca</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="style" value="gradient" />
                  <span className="text-sm">Com gradiente</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg">
              <QrCode className="w-5 h-5 mr-2" />
              Gerar QR Code Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Uso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💡 Dicas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <strong>Para mesas:</strong> Imprima em tamanho A5 (14x20cm) e plastifique para durabilidade.
            </div>
            <div className="text-sm">
              <strong>Para delivery:</strong> Adicione o QR Code em embalagens e sacolas.
            </div>
            <div className="text-sm">
              <strong>Para redes sociais:</strong> Use a versão colorida em posts do Instagram e Facebook.
            </div>
            <div className="text-sm">
              <strong>Para flyers:</strong> Garanta que o QR Code tenha pelo menos 2x2cm quando impresso.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">QR Codes gerados:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Downloads este mês:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Último download:</span>
              <span className="font-medium text-muted-foreground">Nunca</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">
              As estatísticas ajudam a entender como seus QR Codes estão sendo utilizados.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
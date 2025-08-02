'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import ColorPicker from '@/components/theme/color-picker'
import SimpleColorPreview from '@/components/theme/simple-color-preview'
import { 
  Palette, 
  Eye, 
  Save, 
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

export default function ThemePage() {
  const [primaryColor, setPrimaryColor] = useState('#E53E3E')
  const [secondaryColor, setSecondaryColor] = useState('#38A169')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const handleSave = () => {
    // TODO: Implementar salvamento das cores
    console.log('Salvando cores:', { primaryColor, secondaryColor })
  }

  const handleReset = () => {
    setPrimaryColor('#E53E3E')
    setSecondaryColor('#38A169')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Personalização Visual
          </h1>
          <p className="text-muted-foreground">
            Personalize as cores e aparência do seu cardápio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Tema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações de Cores */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cores da Marca
              </CardTitle>
              <CardDescription>
                Escolha as cores que representam sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Cor Primária</Label>
                <ColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  label="Cor principal da marca"
                />
                <p className="text-xs text-muted-foreground">
                  Usada em botões, links e elementos principais
                </p>
              </div>

              <div className="space-y-3">
                <Label>Cor Secundária</Label>
                <ColorPicker
                  color={secondaryColor}
                  onChange={setSecondaryColor}
                  label="Cor secundária"
                />
                <p className="text-xs text-muted-foreground">
                  Usada em destaques e elementos secundários
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
              <CardDescription>
                Preview das variações geradas automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Primária</Label>
                  <SimpleColorPreview color={primaryColor} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Secundária</Label>
                  <SimpleColorPreview color={secondaryColor} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controles de Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </CardTitle>
              <CardDescription>
                Visualize em diferentes dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview do Cardápio */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Preview do Cardápio</CardTitle>
              <CardDescription>
                Veja como seu cardápio ficará com as cores selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border rounded-lg overflow-hidden ${
                  previewDevice === 'mobile' ? 'max-w-sm mx-auto' :
                  previewDevice === 'tablet' ? 'max-w-2xl mx-auto' :
                  'w-full'
                }`}
                style={{
                  '--primary-500': primaryColor,
                  '--secondary-500': secondaryColor,
                } as React.CSSProperties}
              >
                {/* Header Preview */}
                <div 
                  className="p-6 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <h2 className="text-2xl font-bold mb-2">Pizzaria Exemplo</h2>
                  <p className="opacity-90">A melhor pizzaria da região com massa artesanal</p>
                  <div className="flex gap-4 text-sm mt-4 opacity-80">
                    <span>📍 Rua das Pizzas, 123</span>
                    <span>📞 (11) 3333-3333</span>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Pizza Margherita</h3>
                          <p className="text-sm text-gray-600">
                            Molho de tomate, mussarela e manjericão
                          </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Destaque
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-xl font-bold"
                          style={{ color: primaryColor }}
                        >
                          R$ 32,90
                        </span>
                        <button 
                          className="px-4 py-2 rounded text-white text-sm font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Pizza Pepperoni</h3>
                          <p className="text-sm text-gray-600">
                            Molho de tomate, mussarela e pepperoni
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-xl font-bold"
                          style={{ color: primaryColor }}
                        >
                          R$ 36,90
                        </span>
                        <button 
                          className="px-4 py-2 rounded border text-sm font-medium"
                          style={{ 
                            borderColor: primaryColor,
                            color: primaryColor
                          }}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Cart Preview */}
                  <div className="fixed bottom-4 right-4 max-w-xs">
                    <div 
                      className="px-4 py-3 rounded-full text-white shadow-lg flex items-center gap-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span>🛒 2 itens - R$ 69,80</span>
                    </div>
                  </div>
                </div>

                {/* Category Sidebar Preview */}
                <div className="bg-gray-50 p-4 border-t">
                  <h4 className="font-medium mb-3">Categorias</h4>
                  <div className="space-y-2">
                    <div 
                      className="px-3 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Pizzas Tradicionais
                    </div>
                    <div className="px-3 py-2 rounded bg-gray-200 text-gray-700 text-sm">
                      Pizzas Especiais
                    </div>
                    <div className="px-3 py-2 rounded bg-gray-200 text-gray-700 text-sm">
                      Bebidas
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sobre o Sistema de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Sistema Inteligente</h5>
                <p className="text-sm text-blue-700">
                  O AllGoMenu gera automaticamente uma paleta completa de 11 tons para cada cor, 
                  garantindo harmonia visual e acessibilidade em todo o cardápio.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">Acessibilidade</h5>
                <p className="text-sm text-green-700">
                  Todas as combinações de cores são validadas automaticamente para garantir 
                  contraste adequado e legibilidade para todos os usuários.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
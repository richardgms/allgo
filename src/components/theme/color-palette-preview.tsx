"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type ColorVariations } from '@/lib/color/color-utils'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ColorPalettePreviewProps {
  palette: ColorVariations
  name: string
  description?: string
}

export default function ColorPalettePreview({ palette, name, description }: ColorPalettePreviewProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyColor = async (color: string, shade: string) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(`${name}-${shade}`)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (error) {
      console.warn('Erro ao copiar cor:', error)
    }
  }

  const getColorName = (colorName: string) => {
    const names: Record<string, string> = {
      primary: 'Principal',
      secondary: 'Secundária',
      destructive: 'Erro',
      warning: 'Aviso'
    }
    return names[colorName] || colorName
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Paleta {getColorName(name)}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            11 tons
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-11 gap-2">
          {Object.entries(palette).map(([shade, color]) => (
            <div key={shade} className="text-center">
              {/* Cor */}
              <button
                onClick={() => copyColor(color, shade)}
                className="w-full h-14 rounded-lg border shadow-sm hover:shadow-md transition-all hover:scale-105 relative group"
                style={{ backgroundColor: color }}
                title={`${name}-${shade}: ${color}`}
              >
                {/* Ícone de copiar no hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                  {copiedColor === `${name}-${shade}` ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

              {/* Informações */}
              <div className="mt-2 space-y-1">
                <div className={`text-xs font-medium ${shade === '500' ? 'text-primary font-bold' : 'text-foreground'}`}>
                  {shade}
                  {shade === '500' && (
                    <div className="text-[10px] text-primary">BASE</div>
                  )}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  {color.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informação sobre a cor base */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: palette[500] }}
            />
            <span>
              <strong>{name}-500</strong> é a cor base definida pelo usuário
            </span>
          </div>
        </div>

        {/* Dicas de uso */}
        <div className="mt-3 text-xs text-muted-foreground">
          <div className="mb-1"><strong>Tons claros (50-400):</strong> Fundos, estados hover</div>
          <div className="mb-1"><strong>Cor base (500):</strong> Botões principais, links</div>
          <div><strong>Tons escuros (600-950):</strong> Textos, bordas, estados ativos</div>
        </div>
      </CardContent>
    </Card>
  )
}
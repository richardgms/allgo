"use client"

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { hexToHsl, hslToHex, isValidHex, normalizeHex } from '@/lib/color/color-utils'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

export default function ColorPicker({ color, onChange, label, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)
  const [hsl, setHsl] = useState(() => {
    try {
      return hexToHsl(color)
    } catch {
      return { h: 0, s: 50, l: 50 }
    }
  })

  // Predefined colors para seleção rápida
  const presetColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', // Vermelhos/Laranjas
    '#84CC16', '#22C55E', '#10B981', '#059669', // Verdes
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', // Azuis
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', // Roxos/Rosas
    '#6B7280', '#374151', '#111827', '#000000'  // Neutros
  ]

  const updateHSL = useCallback((newHsl: typeof hsl) => {
    setHsl(newHsl)
    const newHex = hslToHex(newHsl)
    setInputValue(newHex)
    onChange(newHex)
  }, [onChange])

  const handleHexChange = useCallback((hex: string) => {
    setInputValue(hex)
    
    if (isValidHex(hex)) {
      try {
        const normalized = normalizeHex(hex)
        const newHsl = hexToHsl(normalized)
        setHsl(newHsl)
        onChange(normalized)
      } catch (error) {
        console.warn('Invalid hex color:', hex)
      }
    }
  }, [onChange])

  const selectPresetColor = useCallback((color: string) => {
    handleHexChange(color)
  }, [handleHexChange])

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium mb-3 block">
          {label}
        </Label>
      )}
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {/* Preview da cor */}
            <div 
              className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: inputValue }}
            />
            
            <div className="flex-1">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                Cor HEX
              </Label>
              <Input
                id="hex-input"
                value={inputValue}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#3B82F6"
                className="mt-1"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Controles HSL */}
          <div className="space-y-4">
            {/* Matiz (Hue) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-muted-foreground">Matiz</Label>
                <Badge variant="outline" className="text-xs">
                  {Math.round(hsl.h)}°
                </Badge>
              </div>
              <div className="relative">
                <Slider
                  value={[hsl.h]}
                  onValueChange={([h]) => updateHSL({ ...hsl, h })}
                  max={360}
                  step={1}
                  className="hue-slider"
                />
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                  }}
                />
              </div>
            </div>

            {/* Saturação */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-muted-foreground">Saturação</Label>
                <Badge variant="outline" className="text-xs">
                  {Math.round(hsl.s)}%
                </Badge>
              </div>
              <Slider
                value={[hsl.s]}
                onValueChange={([s]) => updateHSL({ ...hsl, s })}
                max={100}
                step={1}
              />
            </div>

            {/* Luminosidade */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-muted-foreground">Luminosidade</Label>
                <Badge variant="outline" className="text-xs">
                  {Math.round(hsl.l)}%
                </Badge>
              </div>
              <Slider
                value={[hsl.l]}
                onValueChange={([l]) => updateHSL({ ...hsl, l })}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Cores predefinidas */}
          <div>
            <Label className="text-xs text-muted-foreground mb-3 block">
              Cores Sugeridas
            </Label>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => selectPresetColor(color)}
                  className={`
                    w-8 h-8 rounded-md border-2 transition-all hover:scale-110
                    ${inputValue.toUpperCase() === color.toUpperCase() 
                      ? 'border-ring ring-2 ring-ring/20' 
                      : 'border-border hover:border-ring/50'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Informações da cor */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>HEX: {inputValue.toUpperCase()}</div>
            <div>HSL: {Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
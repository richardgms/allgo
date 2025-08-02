import { hexToRgb } from './color-utils'

export interface ContrastResult {
  ratio: number
  passes: boolean
  level: 'AA' | 'AAA' | 'fail'
  description: string
}

/**
 * Calcula a luminância relativa de uma cor segundo WCAG 2.1
 * @param hex Cor em formato HEX
 * @returns Luminância relativa (0-1)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  
  // Converte RGB para sRGB linear
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  // Calcula luminância relativa usando coeficientes ITU-R BT.709
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calcula o contraste entre duas cores segundo WCAG 2.1
 * @param color1 Primeira cor em HEX (geralmente fundo)
 * @param color2 Segunda cor em HEX (geralmente texto)
 * @returns Resultado da verificação de contraste
 */
export function checkContrast(color1: string, color2: string): ContrastResult {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  
  // A fórmula de contraste WCAG sempre usa a cor mais clara como numerador
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  
  const ratio = (lighter + 0.05) / (darker + 0.05)
  
  // Determina o nível de conformidade
  let level: 'AA' | 'AAA' | 'fail'
  let passes: boolean
  let description: string
  
  if (ratio >= 7) {
    level = 'AAA'
    passes = true
    description = 'Excelente contraste - atende AAA (7:1)'
  } else if (ratio >= 4.5) {
    level = 'AA'
    passes = true
    description = 'Bom contraste - atende AA (4.5:1)'
  } else if (ratio >= 3) {
    level = 'fail'
    passes = false
    description = 'Contraste insuficiente - apenas para texto grande'
  } else {
    level = 'fail'
    passes = false
    description = 'Contraste muito baixo - não recomendado'
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100, // Arredonda para 2 casas decimais
    passes,
    level,
    description
  }
}

/**
 * Verifica contraste para texto grande (3:1 é suficiente)
 */
export function checkContrastLargeText(color1: string, color2: string): ContrastResult {
  const result = checkContrast(color1, color2)
  
  // Para texto grande, 3:1 é suficiente para AA
  if (result.ratio >= 4.5) {
    return {
      ...result,
      level: 'AAA',
      description: 'Excelente contraste para texto grande'
    }
  } else if (result.ratio >= 3) {
    return {
      ...result,
      passes: true,
      level: 'AA',
      description: 'Bom contraste para texto grande - atende AA (3:1)'
    }
  }
  
  return result
}

/**
 * Combinações críticas que devem ser testadas
 */
export const criticalContrastChecks = [
  // Botões primários
  { bg: 'primary-500', fg: 'primary-50', name: 'Botão Principal', type: 'normal' },
  { bg: 'primary-600', fg: 'primary-50', name: 'Botão Principal (Hover)', type: 'normal' },
  
  // Botões secundários
  { bg: 'primary-100', fg: 'primary-700', name: 'Botão Secundário', type: 'normal' },
  { bg: 'primary-200', fg: 'primary-700', name: 'Botão Secundário (Hover)', type: 'normal' },
  
  // Textos sobre fundos
  { bg: 'primary-50', fg: 'primary-950', name: 'Texto Principal', type: 'normal' },
  { bg: 'primary-50', fg: 'primary-900', name: 'Texto Secundário', type: 'normal' },
  { bg: 'primary-100', fg: 'primary-600', name: 'Texto Silenciado', type: 'normal' },
  
  // Títulos e texto grande
  { bg: 'primary-50', fg: 'primary-800', name: 'Título Principal', type: 'large' },
  
  // Estados de erro
  { bg: 'destructive-500', fg: 'destructive-50', name: 'Botão de Erro', type: 'normal' },
  { bg: 'destructive-100', fg: 'destructive-800', name: 'Alert de Erro', type: 'normal' },
  
  // Estados de aviso
  { bg: 'warning-500', fg: 'warning-50', name: 'Botão de Aviso', type: 'normal' },
  { bg: 'warning-100', fg: 'warning-800', name: 'Alert de Aviso', type: 'normal' },
  
  // Secundária/Sucesso
  { bg: 'secondary-500', fg: 'secondary-50', name: 'Botão de Sucesso', type: 'normal' },
  { bg: 'secondary-100', fg: 'secondary-800', name: 'Alert de Sucesso', type: 'normal' },
] as const

export type ContrastCheck = typeof criticalContrastChecks[number]

/**
 * Extrai cor de uma paleta usando notação como "primary-500"
 */
export function getColorFromPalette(palettes: any, colorKey: string): string {
  const [colorName, shade] = colorKey.split('-')
  
  if (palettes[colorName] && palettes[colorName][shade]) {
    return palettes[colorName][shade]
  }
  
  // Fallback para cores semânticas
  const semanticColors: Record<string, string> = {
    'background': palettes.primary?.[50] || '#ffffff',
    'foreground': palettes.primary?.[950] || '#000000',
    'card': palettes.primary?.[50] || '#ffffff',
    'card-foreground': palettes.primary?.[950] || '#000000',
    'muted': palettes.primary?.[100] || '#f5f5f5',
    'muted-foreground': palettes.primary?.[600] || '#666666',
  }
  
  return semanticColors[colorKey] || '#000000'
}

/**
 * Executa todas as verificações críticas de contraste
 */
export function runContrastAudit(palettes: any): Record<string, ContrastResult> {
  const results: Record<string, ContrastResult> = {}
  
  criticalContrastChecks.forEach(check => {
    const bgColor = getColorFromPalette(palettes, check.bg)
    const fgColor = getColorFromPalette(palettes, check.fg)
    
    results[check.name] = check.type === 'large' 
      ? checkContrastLargeText(bgColor, fgColor)
      : checkContrast(bgColor, fgColor)
  })
  
  return results
}

/**
 * Retorna um resumo dos resultados da auditoria
 */
export function getContrastSummary(results: Record<string, ContrastResult>) {
  const total = Object.keys(results).length
  const passing = Object.values(results).filter(r => r.passes).length
  const failing = total - passing
  
  const aaCount = Object.values(results).filter(r => r.level === 'AA').length
  const aaaCount = Object.values(results).filter(r => r.level === 'AAA').length
  
  return {
    total,
    passing,
    failing,
    aaCount,
    aaaCount,
    passRate: Math.round((passing / total) * 100)
  }
}
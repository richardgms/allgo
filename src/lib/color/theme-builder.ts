import { generateColorVariations, type ColorVariations, isValidHex, normalizeHex } from './color-utils'
import { runContrastAudit, type ContrastResult } from './contrast-checker'

export interface ThemeColors {
  primary: string
  secondary: string
  destructive?: string
  warning?: string
}

export interface ColorPalettes {
  primary: ColorVariations
  secondary: ColorVariations
  destructive: ColorVariations
  warning: ColorVariations
}

export interface ThemeTokens {
  colors: ColorPalettes
  css: Record<string, string>
  contrast: Record<string, ContrastResult>
  summary: {
    total: number
    passing: number
    failing: number
    passRate: number
  }
}

/**
 * Cores padrão do sistema
 */
const DEFAULT_COLORS: Required<ThemeColors> = {
  primary: '#3B82F6',    // Azul
  secondary: '#10B981',  // Verde
  destructive: '#EF4444', // Vermelho
  warning: '#F59E0B'     // Amarelo/Laranja
}

/**
 * Valida e normaliza as cores de entrada
 */
export function validateThemeColors(colors: ThemeColors): Required<ThemeColors> {
  const validated: Required<ThemeColors> = {
    primary: DEFAULT_COLORS.primary,
    secondary: DEFAULT_COLORS.secondary,
    destructive: DEFAULT_COLORS.destructive,
    warning: DEFAULT_COLORS.warning
  }

  // Valida cor primária
  if (colors.primary && isValidHex(colors.primary)) {
    validated.primary = normalizeHex(colors.primary)
  }

  // Valida cor secundária
  if (colors.secondary && isValidHex(colors.secondary)) {
    validated.secondary = normalizeHex(colors.secondary)
  }

  // Valida cor destrutiva (opcional)
  if (colors.destructive && isValidHex(colors.destructive)) {
    validated.destructive = normalizeHex(colors.destructive)
  }

  // Valida cor de aviso (opcional)
  if (colors.warning && isValidHex(colors.warning)) {
    validated.warning = normalizeHex(colors.warning)
  }

  return validated
}

/**
 * Gera todas as paletas de cores automaticamente
 */
export function generateColorPalettes(colors: ThemeColors): ColorPalettes {
  const validatedColors = validateThemeColors(colors)

  return {
    primary: generateColorVariations(validatedColors.primary),
    secondary: generateColorVariations(validatedColors.secondary),
    destructive: generateColorVariations(validatedColors.destructive),
    warning: generateColorVariations(validatedColors.warning)
  }
}

/**
 * Gera as variáveis CSS para o tema
 */
export function generateCSSVariables(palettes: ColorPalettes): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Gera variáveis para cada paleta
  Object.entries(palettes).forEach(([colorName, palette]) => {
    Object.entries(palette).forEach(([shade, color]) => {
      cssVars[`--${colorName}-${shade}`] = String(color)
    })
  })

  // Variáveis semânticas para modo claro
  cssVars['--background'] = palettes.primary[50]
  cssVars['--foreground'] = palettes.primary[950]
  cssVars['--card'] = palettes.primary[50]
  cssVars['--card-foreground'] = palettes.primary[950]
  cssVars['--popover'] = palettes.primary[50]
  cssVars['--popover-foreground'] = palettes.primary[950]
  cssVars['--muted'] = palettes.primary[100]
  cssVars['--muted-foreground'] = palettes.primary[600]
  cssVars['--accent'] = palettes.secondary[100]
  cssVars['--accent-foreground'] = palettes.secondary[900]
  cssVars['--border'] = palettes.primary[200]
  cssVars['--input'] = palettes.primary[300]
  cssVars['--ring'] = palettes.primary[600]
  cssVars['--radius'] = '0.5rem'

  return cssVars
}

/**
 * Gera variáveis CSS para modo escuro
 */
export function generateDarkModeCSS(palettes: ColorPalettes): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Variáveis semânticas para modo escuro (inversão inteligente)
  cssVars['--background'] = palettes.primary[950]
  cssVars['--foreground'] = palettes.primary[50]
  cssVars['--card'] = palettes.primary[900]
  cssVars['--card-foreground'] = palettes.primary[50]
  cssVars['--popover'] = palettes.primary[900]
  cssVars['--popover-foreground'] = palettes.primary[50]
  cssVars['--muted'] = palettes.primary[800]
  cssVars['--muted-foreground'] = palettes.primary[400]
  cssVars['--accent'] = palettes.secondary[800]
  cssVars['--accent-foreground'] = palettes.secondary[50]
  cssVars['--border'] = palettes.primary[700]
  cssVars['--input'] = palettes.primary[700]
  cssVars['--ring'] = palettes.primary[400]

  return cssVars
}

/**
 * Converte objeto de CSS para string
 */
export function cssVariablesToString(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
}

/**
 * Gera o CSS completo do tema
 */
export function generateThemeCSS(palettes: ColorPalettes): string {
  const lightVars = generateCSSVariables(palettes)
  const darkVars = generateDarkModeCSS(palettes)

  return `
/* =================== TEMA GERADO AUTOMATICAMENTE =================== */
:root {
${cssVariablesToString(lightVars)}
}

.dark {
${cssVariablesToString(darkVars)}
}

/* =================== CLASSES UTILITÁRIAS =================== */
.restaurant-theme {
  /* Tema aplicado dinamicamente */
}
`
}

/**
 * Função principal para construir tema completo
 */
export function buildThemeTokens(colors: ThemeColors): ThemeTokens {
  // Gera paletas
  const palettes = generateColorPalettes(colors)
  
  // Gera CSS
  const lightVars = generateCSSVariables(palettes)
  const darkVars = generateDarkModeCSS(palettes)
  
  // Verifica contraste
  const contrastResults = runContrastAudit(palettes)
  
  // Calcula resumo
  const total = Object.keys(contrastResults).length
  const passing = Object.values(contrastResults).filter(r => r.passes).length
  const failing = total - passing
  
  return {
    colors: palettes,
    css: {
      ...lightVars,
      ...Object.fromEntries(
        Object.entries(darkVars).map(([key, value]) => [`dark-${key}`, value])
      )
    },
    contrast: contrastResults,
    summary: {
      total,
      passing,
      failing,
      passRate: Math.round((passing / total) * 100)
    }
  }
}

/**
 * Valida se um par de cores tem contraste adequado
 */
export function validateColorPair(color1: string, color2: string): {
  isValid: boolean
  contrast: number
  level: string
} {
  if (!isValidHex(color1) || !isValidHex(color2)) {
    return {
      isValid: false,
      contrast: 0,
      level: 'invalid'
    }
  }

  // Gera paletas temporárias para teste
  const palette1 = generateColorVariations(color1)
  const palette2 = generateColorVariations(color2)
  
  // Testa contraste entre cor base e tons claros/escuros
  const palettes = { primary: palette1, secondary: palette2 }
  const contrastResult = runContrastAudit({
    primary: palette1,
    secondary: palette2,
    destructive: generateColorVariations('#EF4444'),
    warning: generateColorVariations('#F59E0B')
  })
  
  // Conta quantos testes passaram
  const passing = Object.values(contrastResult).filter(r => r.passes).length
  const total = Object.values(contrastResult).length
  const passRate = (passing / total) * 100
  
  return {
    isValid: passRate >= 70, // Considera válido se 70% dos testes passarem
    contrast: passRate,
    level: passRate >= 90 ? 'excellent' : passRate >= 70 ? 'good' : 'poor'
  }
}

/**
 * Aplica tema dinamicamente no DOM
 */
export function applyThemeToDOM(tokens: ThemeTokens, isDark = false): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('applyThemeToDOM called on server side')
    return
  }
  
  const root = document.documentElement
  
  // Remove classe dark se existir
  root.classList.remove('dark')
  
  // Aplica variáveis do modo claro
  Object.entries(tokens.css).forEach(([key, value]) => {
    if (!key.startsWith('dark-')) {
      root.style.setProperty(key, value)
    }
  })
  
  // Se modo escuro, aplica classe e variáveis escuras
  if (isDark) {
    root.classList.add('dark')
    Object.entries(tokens.css).forEach(([key, value]) => {
      if (key.startsWith('dark-')) {
        const cleanKey = key.replace('dark-', '')
        root.style.setProperty(cleanKey, value)
      }
    })
  }
}

/**
 * Obtém tema padrão do AllGoMenu
 */
export function getDefaultTheme(): ThemeTokens {
  return buildThemeTokens(DEFAULT_COLORS)
}
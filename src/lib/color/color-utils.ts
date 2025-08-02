// Interfaces para manipulação de cores
export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface ColorVariations {
  50: string   // +90% lighter
  100: string  // +80% lighter
  200: string  // +70% lighter
  300: string  // +60% lighter
  400: string  // +50% lighter
  500: string  // BASE COLOR (cor definida pelo usuário)
  600: string  // +20% darker
  700: string  // +40% darker
  800: string  // +60% darker
  900: string  // +80% darker
  950: string  // +90% darker
}

/**
 * Converte cor HEX para RGB
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

/**
 * Converte RGB para HEX
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (c: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Converte RGB para HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  const sum = max + min
  const l = sum / 2

  let h: number
  let s: number

  if (diff === 0) {
    h = s = 0 // achromatic
  } else {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum

    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / diff + 2
        break
      case b:
        h = (r - g) / diff + 4
        break
      default:
        h = 0
    }
    h /= 6
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  }
}

/**
 * Converte HSL para RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Converte HEX para HSL
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex))
}

/**
 * Converte HSL para HEX
 */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl))
}

/**
 * Interpola uma cor HSL em direção ao branco (L=100%)
 * Preserva H e S, ajusta apenas L
 */
export function interpolateToWhite(hsl: HSL, factor: number): string {
  const newLightness = Math.min(100, hsl.l + (100 - hsl.l) * factor)
  return hslToHex({ ...hsl, l: newLightness })
}

/**
 * Interpola uma cor HSL em direção ao preto (L=0%)
 * Preserva H e S, ajusta apenas L
 */
export function interpolateToBlack(hsl: HSL, factor: number): string {
  const newLightness = Math.max(0, hsl.l - (hsl.l * factor))
  return hslToHex({ ...hsl, l: newLightness })
}

/**
 * Gera variações tonais usando interpolação HSL
 * @param baseColor Cor base em formato HEX (#RRGGBB)
 * @returns Objeto com todas as variações (50-950)
 */
export function generateColorVariations(baseColor: string): ColorVariations {
  // Converter HEX para HSL
  const baseHsl = hexToHsl(baseColor)
  
  return {
    // Tons mais claros (interpolação em direção ao branco)
    50: interpolateToWhite(baseHsl, 0.9),   // 90% do caminho para branco
    100: interpolateToWhite(baseHsl, 0.8),  // 80% do caminho para branco
    200: interpolateToWhite(baseHsl, 0.7),  // 70% do caminho para branco
    300: interpolateToWhite(baseHsl, 0.6),  // 60% do caminho para branco
    400: interpolateToWhite(baseHsl, 0.5),  // 50% do caminho para branco
    
    // Cor base original
    500: baseColor,
    
    // Tons mais escuros (interpolação em direção ao preto)
    600: interpolateToBlack(baseHsl, 0.2),  // 20% do caminho para preto
    700: interpolateToBlack(baseHsl, 0.4),  // 40% do caminho para preto
    800: interpolateToBlack(baseHsl, 0.6),  // 60% do caminho para preto
    900: interpolateToBlack(baseHsl, 0.8),  // 80% do caminho para preto
    950: interpolateToBlack(baseHsl, 0.9),  // 90% do caminho para preto
  }
}

/**
 * Valida se uma string é uma cor HEX válida
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

/**
 * Normaliza uma cor HEX para o formato de 6 dígitos
 */
export function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) {
    hex = '#' + hex
  }
  
  if (hex.length === 4) {
    // Converte #RGB para #RRGGBB
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }
  
  return hex.toUpperCase()
}
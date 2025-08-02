"use client"

import { useState, useEffect, useCallback } from 'react'
import { buildThemeTokens, applyThemeToDOM, getDefaultTheme, type ThemeColors, type ThemeTokens } from '@/lib/color/theme-builder'

export interface UseThemeOptions {
  defaultColors?: ThemeColors
  persistKey?: string
  applyToDOM?: boolean
}

export function useTheme(options: UseThemeOptions = {}) {
  const {
    defaultColors,
    persistKey = 'allgomenu-theme',
    applyToDOM = true
  } = options

  // Estado de hidratação
  const [hasHydrated, setHasHydrated] = useState(false)

  // Estado do tema
  const [themeTokens, setThemeTokens] = useState<ThemeTokens>(() => {
    if (defaultColors) {
      return buildThemeTokens(defaultColors)
    }
    return getDefaultTheme()
  })

  // Estado do modo escuro
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Carrega tema salvo (apenas no cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        const savedTheme = JSON.parse(saved)
        if (savedTheme.colors) {
          const newTokens = buildThemeTokens({
            primary: savedTheme.colors.primary[500],
            secondary: savedTheme.colors.secondary[500],
            destructive: savedTheme.colors.destructive?.[500],
            warning: savedTheme.colors.warning?.[500]
          })
          setThemeTokens(newTokens)
        }
      }

      // Carrega preferência de modo escuro
      const darkMode = localStorage.getItem(`${persistKey}-dark`)
      if (darkMode !== null) {
        setIsDarkMode(darkMode === 'true')
      } else {
        // Detecta preferência do sistema
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(systemPrefersDark)
      }
    } catch (error) {
      console.warn('Erro ao carregar tema salvo:', error)
    } finally {
      // Marca como hidratado
      setHasHydrated(true)
    }
  }, [persistKey])

  // Aplica tema no DOM quando muda (apenas após hidratação)
  useEffect(() => {
    if (applyToDOM && hasHydrated && typeof window !== 'undefined') {
      applyThemeToDOM(themeTokens, isDarkMode)
    }
  }, [themeTokens, isDarkMode, applyToDOM, hasHydrated])

  // Atualiza cores do tema
  const updateColors = useCallback((newColors: ThemeColors) => {
    const newTokens = buildThemeTokens(newColors)
    setThemeTokens(newTokens)

    // Salva no localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(persistKey, JSON.stringify(newTokens))
      } catch (error) {
        console.warn('Erro ao salvar tema:', error)
      }
    }
  }, [persistKey])

  // Alterna modo escuro
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    // Salva preferência
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${persistKey}-dark`, newMode.toString())
      } catch (error) {
        console.warn('Erro ao salvar preferência de modo escuro:', error)
      }
    }
  }, [isDarkMode, persistKey])

  // Define modo escuro
  const setDarkMode = useCallback((dark: boolean) => {
    setIsDarkMode(dark)

    // Salva preferência
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${persistKey}-dark`, dark.toString())
      } catch (error) {
        console.warn('Erro ao salvar preferência de modo escuro:', error)
      }
    }
  }, [persistKey])

  // Reseta para tema padrão
  const resetToDefault = useCallback(() => {
    const defaultTokens = getDefaultTheme()
    setThemeTokens(defaultTokens)

    // Remove do localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(persistKey)
      } catch (error) {
        console.warn('Erro ao limpar tema salvo:', error)
      }
    }
  }, [persistKey])

  // Obtém cores base atuais
  const getCurrentColors = useCallback((): ThemeColors => {
    return {
      primary: themeTokens.colors.primary[500],
      secondary: themeTokens.colors.secondary[500],
      destructive: themeTokens.colors.destructive[500],
      warning: themeTokens.colors.warning[500]
    }
  }, [themeTokens])

  return {
    // Estado
    themeTokens,
    isDarkMode,
    hasHydrated,
    
    // Ações
    updateColors,
    toggleDarkMode,
    setDarkMode,
    resetToDefault,
    getCurrentColors,
    
    // Informações de contraste
    contrastResults: themeTokens.contrast,
    contrastSummary: themeTokens.summary,
    
    // CSS gerado
    cssVariables: themeTokens.css,
    
    // Cores atuais
    colors: getCurrentColors()
  }
}
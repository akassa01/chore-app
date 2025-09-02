'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUserTheme, applyUserTheme, UserTheme } from '@/lib/themes'
import { User } from '@/lib/supabaseClient'

interface ThemeContextType {
  currentTheme: UserTheme | null
  applyTheme: (userName: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  currentUser: User | null
}

export function ThemeProvider({ children, currentUser }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<UserTheme | null>(null)

  const applyTheme = (userName: string) => {
    // Apply the theme to the DOM
    applyUserTheme(userName)

    // Update state
    const theme = getUserTheme(userName)
    setCurrentTheme(theme)
  }

  useEffect(() => {
    // Apply theme when user changes
    if (currentUser) {
      applyTheme(currentUser.name)
    } else {
      // Apply default theme when no user
      applyTheme('Default') // Default fallback
    }
  }, [currentUser])

  // Also apply theme on component mount to ensure it's set
  useEffect(() => {
    if (currentUser) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        applyTheme(currentUser.name)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [])

  const contextValue: ThemeContextType = {
    currentTheme,
    applyTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
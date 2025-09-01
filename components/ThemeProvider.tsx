'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/supabaseClient'
import { getUserTheme, applyUserTheme, UserTheme } from '@/lib/themes'

interface ThemeContextType {
  currentTheme: UserTheme | null
  applyTheme: (userName: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ 
  children, 
  currentUser 
}: { 
  children: React.ReactNode
  currentUser: User | null 
}) {
  const [currentTheme, setCurrentTheme] = useState<UserTheme | null>(null)

  const applyTheme = (userName: string) => {
    const theme = getUserTheme(userName)
    setCurrentTheme(theme)
    applyUserTheme(userName)
  }

  useEffect(() => {
    if (currentUser) {
      applyTheme(currentUser.name)
    }
  }, [currentUser])

  return (
    <ThemeContext.Provider value={{ currentTheme, applyTheme }}>
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

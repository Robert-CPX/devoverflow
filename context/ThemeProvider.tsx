'use client'

import React, {useContext, useEffect, useState, createContext} from 'react'

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const ThemeProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [theme, setTheme] = useState('light')

  const handleThemeChange = () => {
    if (localStorage.theme === 'dark' ||
       (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    handleThemeChange()
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
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

export default ThemeProvider

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// Apply immediately before first render to prevent flash
const initDark = localStorage.getItem('darkMode') === 'true'
document.documentElement.setAttribute('data-bs-theme', initDark ? 'dark' : 'light')

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('preferences')) || {
        emailNotifications: true,
        orderUpdates: true,
        promotionalEmails: false,
        language: 'English',
        fontSize: 'medium',
        compactView: false,
      }
    } catch {
      return {
        emailNotifications: true,
        orderUpdates: true,
        promotionalEmails: false,
        language: 'English',
        fontSize: 'medium',
        compactView: false,
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    // Always set explicitly so CSS selectors [data-bs-theme="dark/light"] both work
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences))
    document.documentElement.setAttribute('data-font-size', preferences.fontSize)
    if (preferences.compactView) {
      document.documentElement.setAttribute('data-compact-view', 'true')
    } else {
      document.documentElement.removeAttribute('data-compact-view')
    }
  }, [preferences])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, preferences, updatePreference }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

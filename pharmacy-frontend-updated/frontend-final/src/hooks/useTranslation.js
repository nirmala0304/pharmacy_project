import { useTheme } from '../context/ThemeContext'
import { getTranslation } from '../locales/i18n'

export function useTranslation() {
  const { preferences } = useTheme()
  
  const t = (key) => {
    // Map language names to language codes
    const langMap = {
      'English': 'en',
      'Español': 'es',
      'Français': 'fr',
      'हिन्दी': 'hi',
    }
    
    const langCode = langMap[preferences.language] || 'en'
    return getTranslation(langCode, key)
  }

  return { t, currentLanguage: preferences.language }
}

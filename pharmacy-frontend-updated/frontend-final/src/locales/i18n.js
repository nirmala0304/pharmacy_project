import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import hi from './hi.json'

const translations = {
  en: en,
  es: es,
  fr: fr,
  hi: hi,
}

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
]

export function getTranslation(lang, key) {
  const keys = key.split('.')
  let value = translations[lang] || translations.en

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

export function getAllTranslations(lang) {
  return translations[lang] || translations.en
}

export const i18n = {
  t: (key, lang = 'en') => getTranslation(lang, key),
  getLanguages: () => supportedLanguages,
  getSupportedLangs: () => Object.keys(translations),
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en/translation.json';
import hiTranslations from '../locales/hi/translation.json';
import mrTranslations from '../locales/mr/translation.json';

interface TranslationResources {
  [key: string]: {
    translation: Record<string, any>;
  };
}

const resources: TranslationResources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  mr: {
    translation: mrTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;

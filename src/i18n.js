import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';
import jaTranslation from './locales/ja/translation.json';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ja',
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
  });

export default i18n;

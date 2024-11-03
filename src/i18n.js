import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';
import jaTranslation from './locales/ja/translation.json';
import zhTranslation from './locales/zh/translation.json';
import thTranslation from './locales/th/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: 'ja',
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
      zh: {
        translation: zhTranslation,
      },
      th: {
        translation: thTranslation,
      },
    },
  });

export default i18n;

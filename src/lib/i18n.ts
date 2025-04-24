import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import frTranslation from '../i18n/fr.json';
import arTranslation from '../i18n/ar.json';

// Set document direction based on language
const setDocumentDirection = (language: string) => {
  document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', language);
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      fr: {
        translation: frTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    fallbackLng: 'fr',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Set initial document direction
setDocumentDirection(i18n.language);

// Update document direction when language changes
i18n.on('languageChanged', (language) => {
  setDocumentDirection(language);
});

export default i18n;

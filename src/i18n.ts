import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ro from './locales/ro/translation.json';

// Load language synchronously (with fallback)
const getInitialLanguage = () => {
    const saved = localStorage.getItem('languagePreference');
    return saved ?? 'ro';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'ro',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

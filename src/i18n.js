import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languages from './locales';
import { DEFAULT_LANGUAGE } from './configs/language';

i18n.use(initReactI18next).init({
  fallbackLng: ['ch', 'al'],
  lng: DEFAULT_LANGUAGE,
  resources: languages,
  ns: ['common'],
  defaultNS: 'common',
  debug: false,
});

export default i18n;

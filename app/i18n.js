// i18n.js

// Import the core i18next library, which handles internationalization.
import i18n from 'i18next';

// Import the initReactI18next plugin, which allows i18next to integrate with React.
import { initReactI18next } from 'react-i18next';

// Import translation files for different languages. Each file contains key-value pairs for translations.
import translationEN from './en/translation.json'; // English translations
import translationES from './es/translation.json'; // Spanish translations
import translationCH from './ch/translation.json'; // Chinese translations
import translationFR from './fr/translation.json'; // French translations
import translationHI from './hi/translation.json'; // Hindi translations

// Define the translation resources for i18next. 
// Each key (e.g., 'en', 'es') corresponds to a language code, and the value is the translation file for that language.
const resources = {
  en: {
    translation: translationEN // English translations are under the 'translation' namespace
  },
  es: {
    translation: translationES // Spanish translations
  },
  ch: {
    translation: translationCH // Chinese translations
  },
  fr: {
    translation: translationFR // French translations
  },
  hi: {
    translation: translationHI // Hindi translations
  }
};

// Initialize the i18next instance with the React integration plugin (initReactI18next) and configuration options.
i18n
  .use(initReactI18next) // Connects i18next to React by using the initReactI18next plugin.
  .init({
    // Provide the translation resources object, which contains all language data.
    resources,
    
    // Set the default language to English (en).
    lng: "en", // The language that will be used if no other language is selected.
    
    // Set a fallback language to English (en) if a translation is missing in the selected language.
    fallbackLng: "en", // If a key is not found in the current language, fallback to English.

    // Configure interpolation options, which manage how dynamic values are inserted into translations.
    interpolation: {
      escapeValue: false // Disable escaping of values, as React already handles escaping to prevent XSS attacks.
    }
  });

// Export the configured i18next instance so it can be used throughout the application.
export default i18n;

// "use client" // Not strictly needed here as it's just config and instance export

import i18n from "i18next"
// We will call .use() and .init() in the provider
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en/translation.json"
import ptTranslations from "./locales/pt/translation.json"

export const i18nInstance = i18n // Export the raw instance

export const i18nConfig = {
  resources: {
    en: {
      translation: enTranslations,
    },
    pt: {
      translation: ptTranslations,
    },
  },
  fallbackLng: "en",
  debug: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
  detection: {
    order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
    lookupQuerystring: "lng",
    lookupCookie: "i18next",
    lookupLocalStorage: "i18nextLng",
    caches: ["localStorage", "cookie"],
  },
  react: {
    useSuspense: false, // We'll manage loading state explicitly
  },
}

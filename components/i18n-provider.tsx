"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { I18nextProvider } from "react-i18next"
import { initReactI18next } from "react-i18next" // Import here
import LanguageDetector from "i18next-browser-languagedetector" // Import here
import { i18nInstance, i18nConfig } from "@/lib/i18n"
import { Loader2 } from "lucide-react"

interface I18nAppProviderProps {
  children: React.ReactNode
}

export default function I18nAppProvider({ children }: I18nAppProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Ensure this effect runs only once
    if (!i18nInstance.isInitialized) {
      i18nInstance
        .use(LanguageDetector)
        .use(initReactI18next)
        .init(i18nConfig)
        .then(() => {
          setIsInitialized(true)
        })
        .catch((error) => {
          console.error("Failed to initialize i18next:", error)
          // Handle initialization error, maybe set an error state
        })
    } else {
      // Already initialized (e.g., due to HMR or if lib/i18n somehow ran init)
      setIsInitialized(true)
    }
  }, []) // Empty dependency array ensures it runs once on mount

  if (!isInitialized) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 text-gray-800">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Initializing internationalization...</p>
      </div>
    )
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

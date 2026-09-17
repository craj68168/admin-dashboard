"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { NextIntlClientProvider } from "next-intl";

import enMessages from "../../messages/en.json";
import jaMessages from "../../messages/ja.json";

export type Locale = "en" | "ja";

type LanguageContextType = {
  locale: Locale;
  changeLanguage: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const messages = {
  en: enMessages,
  ja: jaMessages,
};

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const savedLocale = localStorage.getItem("locale");

    if (savedLocale === "en" || savedLocale === "ja") {
      return savedLocale;
    }

    return "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);

    localStorage.setItem("locale", newLocale);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLanguage,
      }}
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

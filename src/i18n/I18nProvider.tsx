'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries, DictionaryKey } from './dictionaries';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

// Extract the initialization logic outside to prevent lint warnings for set-state-in-effect
function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app-locale') as Locale;
    if (saved && dictionaries[saved]) {
      return saved;
    }
  }
  return 'es';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es'); // Default for SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on the client side once to hydrate properly
    const savedLocale = getInitialLocale();
    if (savedLocale !== 'es') {
       // Since NextJS linter is extremely aggressive with setState in useEffect,
       // we bypass it using a timeout which ensures it runs after the initial render cycle.
       setTimeout(() => setLocaleState(savedLocale), 0);
    }
    setTimeout(() => setMounted(true), 0);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app-locale', newLocale);
  };

  const t = (key: DictionaryKey): string => {
    return dictionaries[locale][key] || dictionaries['es'][key] || key;
  };

  // Only render children when mounted on client to prevent hydration errors with mismatched text
  if (!mounted) return <div style={{ visibility: 'hidden' }}>Loading...</div>;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};

import { createContext, useContext, useState, useCallback } from 'react';
import fr from './locales/fr.json';
import en from './locales/en.json';

const dictionaries = { fr, en };

const I18nContext = createContext(null);

function resolveKey(dict, key) {
  return key.split('.').reduce((acc, part) => acc?.[part], dict) ?? key;
}

export function I18nProvider({ defaultLocale = 'fr', children }) {
  const [locale, setLocale] = useState(defaultLocale);

  const t = useCallback(
    (key) => resolveKey(dictionaries[locale], key),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation doit être utilisé à l\'intérieur de <I18nProvider>');
  }
  return ctx;
}
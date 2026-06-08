import { useI18nStore } from './store';
import { dictionaries, Dictionary } from './dictionaries';

// A helper type to get nested keys (very basic version)
export function useTranslation() {
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);
  
  const dict = dictionaries[language] as Dictionary;

  // Simple nested key resolver, e.g. "home.heroTitlePrefix"
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: unknown = dict;
    for (const k of keys) {
      if (result === undefined || result === null || typeof result !== 'object') return key;
      result = (result as Record<string, unknown>)[k];
    }
    return typeof result === 'string' ? result : key;
  };

  return { t, language, setLanguage };
}

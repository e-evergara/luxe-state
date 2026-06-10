'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  FormEvent,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SearchSuggestion } from '@/app/api/search-suggestions/route';
import { useTranslation } from '@/lib/i18n/useTranslation';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-mosque/20 text-mosque font-semibold rounded-sm not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function typeIcon(type: string): string {
  const icons: Record<string, string> = {
    house: 'cottage',
    apartment: 'apartment',
    villa: 'villa',
    penthouse: 'roofing',
  };
  return icons[type] ?? 'home';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SmartSearchProps {
  initialValue?: string;
}

export function SmartSearch({ initialValue = '' }: SmartSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------------------
  // Build URL helper
  // -------------------------------------------------------------------------
  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete('page');
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  // -------------------------------------------------------------------------
  // Fetch suggestions (debounced)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const term = inputValue.trim();
      if (term.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(term)}&limit=6`,
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json() as { suggestions: SearchSuggestion[] };
        setSuggestions(json.suggestions ?? []);
        setIsOpen((json.suggestions ?? []).length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  // -------------------------------------------------------------------------
  // Close on outside click
  // -------------------------------------------------------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const selectSuggestion = (suggestion: SearchSuggestion) => {
    const term = suggestion.city ?? suggestion.location ?? suggestion.title;
    setInputValue(term);
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(buildUrl({ search: term }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(buildUrl({ search: inputValue.trim() }));
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    router.push(buildUrl({ search: '' }));
    inputRef.current?.focus();
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div ref={containerRef} className="relative group max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} role="search" aria-label="Property search">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          {isLoading ? (
            <span className="material-icons text-mosque text-2xl animate-spin" style={{ animationDuration: '1s' }}>
              autorenew
            </span>
          ) : (
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id="property-search"
          type="text"
          autoComplete="off"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="search-suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className={`block w-full pl-12 pr-28 py-4 text-lg bg-white dark:bg-white/5 text-nordic-dark dark:text-white placeholder-nordic-muted/60 shadow-soft focus:outline-none transition-all border-2 ${
            isOpen
              ? 'rounded-t-xl rounded-b-none border-mosque border-b-transparent'
              : 'rounded-xl border-transparent focus:border-mosque'
          }`}
          placeholder={t('home.searchPlaceholder')}
        />

        {/* Clear button */}
        {inputValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute inset-y-0 right-[5.5rem] flex items-center px-2 text-nordic-muted hover:text-nordic-dark transition-colors cursor-pointer"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-all flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer active:scale-95"
        >
          {t('home.searchButton')}
        </button>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions-list"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 w-full bg-white dark:bg-nordic-dark border-2 border-mosque border-t-0 rounded-b-xl shadow-[0_16px_40px_-8px_rgba(0,102,85,0.15)] overflow-hidden"
        >
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;
            const displayCity =
              suggestion.city ??
              (suggestion.location ? suggestion.location.split(',').pop()?.trim() : undefined);

            return (
              <li
                key={suggestion.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur before click
                  selectSuggestion(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-mosque/8 dark:bg-mosque/20'
                    : 'hover:bg-mosque/5 dark:hover:bg-white/5'
                }`}
              >
                {/* Type icon */}
                <span className={`material-icons text-xl flex-shrink-0 ${isActive ? 'text-mosque' : 'text-nordic-muted'}`}>
                  {typeIcon(suggestion.type)}
                </span>

                {/* Text content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-nordic-dark dark:text-white truncate">
                    {highlight(suggestion.title, inputValue)}
                  </p>
                  <p className="text-xs text-nordic-muted truncate flex items-center gap-1 mt-0.5">
                    <span className="material-icons text-xs">location_on</span>
                    {suggestion.location
                      ? highlight(suggestion.location, inputValue)
                      : displayCity
                        ? highlight(displayCity, inputValue)
                        : 'Location not set'}
                    {suggestion.zipCode && (
                      <span className="ml-1 text-nordic-muted/70">
                        · {highlight(suggestion.zipCode, inputValue)}
                      </span>
                    )}
                  </p>
                </div>

                {/* Purpose badge */}
                <span
                  className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    suggestion.purpose === 'rent'
                      ? 'bg-hint-of-green text-mosque'
                      : 'bg-nordic-dark/8 dark:bg-white/10 text-nordic-dark dark:text-white'
                  }`}
                >
                  {suggestion.purpose === 'rent' ? 'Rent' : 'Buy'}
                </span>
              </li>
            );
          })}

          {/* Footer hint */}
          <li className="px-4 py-2 border-t border-nordic-dark/5 dark:border-white/5 flex items-center gap-1.5">
            <span className="material-icons text-sm text-nordic-muted">keyboard_return</span>
            <span className="text-xs text-nordic-muted">
              Press Enter to search all results
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        className="flex items-center justify-center w-8 h-8 rounded-md text-nordic-dark hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="material-icons text-xl">language</span>
        <span className="ml-1 text-xs font-medium uppercase">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-24 bg-white dark:bg-[#152e2a] rounded-lg shadow-lg border border-nordic-dark/5 dark:border-white/10 overflow-hidden z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'en' | 'es');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                  language === lang.code
                    ? 'bg-mosque/10 text-mosque font-medium'
                    : 'text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

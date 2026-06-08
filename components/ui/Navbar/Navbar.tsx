'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface NavbarProps {
  currentTab?: string;
  onTabChange?: (tab: 'all' | 'buy' | 'rent') => void;
}

export function Navbar({ currentTab = 'all', onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Get initial session
    supabaseBrowserClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Read the current dark class from <html> lazily (runs once on mount, client-side only)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  };

  const handleTabClick = (tab: 'all' | 'buy' | 'rent', e: React.MouseEvent) => {
    e.preventDefault();
    onTabChange?.(tab);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={(e) => handleTabClick('all', e)}
          >
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark dark:text-white">
              LuxeEstate
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            {(['buy', 'rent'] as const).map((tab) => (
              <a
                key={tab}
                href="#"
                onClick={(e) => handleTabClick(tab, e)}
                className={`font-medium text-sm px-1 py-1 transition-all cursor-pointer ${
                  currentTab === tab
                    ? 'text-mosque border-b-2 border-mosque'
                    : 'text-nordic-dark/70 dark:text-white/60 hover:text-nordic-dark dark:hover:text-white hover:border-b-2 hover:border-nordic-dark/20'
                }`}
              >
                {t(`nav.${tab}`)}
              </a>
            ))}
            <a
              href="#"
              className="text-nordic-dark/70 dark:text-white/60 hover:text-nordic-dark dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
            >
              {t('nav.sell')}
            </a>
            <a
              href="#"
              className="text-nordic-dark/70 dark:text-white/60 hover:text-nordic-dark dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
            >
              {t('nav.savedHomes')}
            </a>
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer">
              <span className="material-icons">search</span>
            </button>

            {/* Notifications */}
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors relative cursor-pointer">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-icons text-xl">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-icons">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>

            {/* i18n / Language toggle */}
            <LanguageSwitcher />

            {/* Avatar or Login */}
            <div className="relative flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2">
              {user ? (
                <>
                  <button
                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative cursor-pointer"
                    title="Profile menu"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        alt={user.user_metadata?.full_name || "Profile"}
                        className="object-cover"
                        src={user.user_metadata.avatar_url}
                        fill
                        sizes="36px"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-mosque text-white text-sm font-semibold uppercase">
                        {user.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {avatarMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#152e2a] rounded-xl shadow-lg border border-nordic-dark/5 dark:border-white/10 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-nordic-dark/5 dark:border-white/5">
                        <p className="text-sm font-medium text-nordic-dark dark:text-white truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            supabaseBrowserClient.auth.signOut();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span className="material-icons text-sm">logout</span>
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white bg-mosque hover:bg-mosque/90 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {t('nav.signIn')}
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden border-t border-nordic-dark/5 dark:border-white/5 bg-background-light dark:bg-background-dark overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-60' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {(['buy', 'rent'] as const).map((tab) => (
            <a
              key={tab}
              href="#"
              onClick={(e) => { handleTabClick(tab, e); setMobileMenuOpen(false); }}
              className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer capitalize ${
                currentTab === tab
                  ? 'text-mosque bg-mosque/10'
                  : 'text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t(`nav.${tab}`)}
            </a>
          ))}
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5">
            {t('nav.sell')}
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5">
            {t('nav.savedHomes')}
          </a>
        </div>
      </div>
    </nav>
  );
}

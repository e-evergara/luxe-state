'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NavbarProps {
  currentTab?: string;
  onTabChange?: (tab: 'all' | 'buy' | 'rent') => void;
}

export function Navbar({ currentTab = 'all', onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </a>
            ))}
            <a
              href="#"
              className="text-nordic-dark/70 dark:text-white/60 hover:text-nordic-dark dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-nordic-dark/70 dark:text-white/60 hover:text-nordic-dark dark:hover:text-white font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
            >
              Saved Homes
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

            {/* Avatar */}
            <button className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative">
                <Image
                  alt="Profile"
                  className="object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                  fill
                  sizes="36px"
                  priority
                />
              </div>
            </button>
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
              {tab}
            </a>
          ))}
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5">
            Sell
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark dark:text-white hover:bg-black/5 dark:hover:bg-white/5">
            Saved Homes
          </a>
        </div>
      </div>
    </nav>
  );
}

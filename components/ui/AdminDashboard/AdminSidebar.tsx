'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { supabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  displayName: string;
  avatarUrl?: string;
}

const navItems = [
  {
    href: '/admin/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    href: '/admin/dashboard#properties',
    icon: 'home_work',
    label: 'Propiedades',
  },
  {
    href: '/admin/dashboard#users',
    icon: 'manage_accounts',
    label: 'Usuarios',
  },
  {
    href: '/',
    icon: 'open_in_new',
    label: 'Ver sitio',
  },
];

export function AdminSidebar({ displayName, avatarUrl }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.replace('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#19322F] dark:bg-[#0a1f1c] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-40">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#006655] rounded-lg flex items-center justify-center shadow-lg">
            <span className="material-icons text-white text-xl">real_estate_agent</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">LuxeEstate</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 mb-3 text-white/30 text-[10px] font-semibold uppercase tracking-widest">
          Menú
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin/dashboard' && pathname === '/admin/dashboard';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-[#006655] text-white shadow-[0_4px_12px_rgba(0,102,85,0.4)]'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }
              `}
            >
              <span
                className={`material-icons text-xl transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-white/50 group-hover:text-white'
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D9ECC8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile + Sign out */}
      <div className="px-3 pb-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#006655] flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons text-white text-lg">person</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{displayName}</p>
            <p className="text-white/40 text-[10px]">Administrador</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          id="admin-signout-btn"
        >
          <span className="material-icons text-xl group-hover:scale-110 transition-transform duration-200">
            logout
          </span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

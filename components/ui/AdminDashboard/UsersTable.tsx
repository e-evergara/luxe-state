'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Image from 'next/image';
import { UserRoleRecord, UserRole } from '@/types/user';
import { updateUserRoleAction } from '@/app/admin/actions';

interface UsersTableProps {
  userRoles: UserRoleRecord[];
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function UserAvatar({
  avatarUrl,
  displayName,
  email,
}: {
  avatarUrl?: string;
  displayName?: string;
  email?: string;
}) {
  const initials = (displayName ?? email ?? '?')[0].toUpperCase();
  return (
    <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#006655] border-2 border-white dark:border-[#006655] shadow-sm flex items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName ?? email ?? 'Usuario'}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-base font-bold">{initials}</span>
      )}
    </div>
  );
}

interface RoleDropdownProps {
  userId: string;
  currentRole: UserRole;
}

function RoleDropdown({ userId, currentRole }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(currentRole);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === role) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.success) {
        setRole(newRole);
      } else {
        alert('Error al actualizar el rol');
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center px-4 py-2 border border-[#19322F]/10 dark:border-white/10 bg-white dark:bg-[#1a3833] text-xs font-semibold rounded-lg text-[#19322F] dark:text-white hover:bg-[#19322F] hover:text-white dark:hover:bg-white dark:hover:text-[#19322F] focus:outline-none transition-colors w-full md:w-auto justify-center cursor-pointer disabled:opacity-50`}
      >
        {isPending ? (
          <span className="material-icons text-xs animate-spin mr-1">refresh</span>
        ) : null}
        Cambiar Rol
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-[#006655] ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right animate-fade-in-down border border-[#004d40]">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full group flex items-center px-4 py-3 text-xs text-left transition-colors ${
                role === 'admin'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              role="menuitem"
            >
              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                shield
              </span>
              Administrador
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className={`w-full group flex items-center px-4 py-3 text-xs text-left transition-colors ${
                role === 'user'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              role="menuitem"
            >
              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">
                person
              </span>
              Usuario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function UsersTable({ userRoles }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'user'>('all');

  const filteredUsers = userRoles.filter((ur) => {
    const matchesSearch =
      (ur.displayName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ur.email ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'all' || ur.role === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <section id="users" className="scroll-mt-8">
      {/* Header section matching User Directory mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#19322F] dark:text-white">
            Directorio de Usuarios
          </h2>
          <p className="text-[#19322F]/60 dark:text-gray-400 mt-1 text-sm">
            Administra los accesos y roles de los usuarios de LuxeEstate.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search by name/email */}
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-[#19322F]/40 group-focus-within:text-[#006655] text-xl">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white shadow-sm placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 mb-6 flex gap-6 border-b border-[#19322F]/10 dark:border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-white/60 hover:text-[#19322F] dark:hover:text-white'
          }`}
        >
          Todos ({userRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'admin'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-white/60 hover:text-[#19322F] dark:hover:text-white'
          }`}
        >
          Administradores ({userRoles.filter((u) => u.role === 'admin').length})
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`pb-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'user'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-white/60 hover:text-[#19322F] dark:hover:text-white'
          }`}
        >
          Usuarios ({userRoles.filter((u) => u.role === 'user').length})
        </button>
      </div>

      {/* Column Headers (visible on larger screens) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#19322F]/50 dark:text-white/40 mb-3">
        <div className="col-span-4">Detalles del Usuario</div>
        <div className="col-span-3">Rol &amp; Estado</div>
        <div className="col-span-3">Actividad</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>

      {/* User Directory Cards Container */}
      <div className="space-y-4">
        {filteredUsers.map((ur) => {
          const isAdmin = ur.role === 'admin';
          return (
            <div
              key={ur.userId}
              className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                isAdmin
                  ? 'bg-[#D9ECC8]/20 dark:bg-[#006655]/10 border-[#006655]/20 dark:border-[#006655]/30'
                  : 'bg-white dark:bg-[#152e2a] border-[#19322F]/6 dark:border-white/6 hover:bg-[#D9ECC8]/10 dark:hover:bg-[#006655]/5'
              }`}
            >
              {/* User Details */}
              <div className="col-span-12 md:col-span-4 flex items-center w-full">
                <div className="relative">
                  <UserAvatar
                    avatarUrl={ur.avatarUrl}
                    displayName={ur.displayName}
                    email={ur.email}
                  />
                  {ur.lastSignInAt && (
                    <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-[#152e2a]"></span>
                  )}
                </div>
                <div className="ml-4 overflow-hidden">
                  <div className="text-sm font-bold text-[#19322F] dark:text-white truncate">
                    {ur.displayName ?? 'Sin nombre'}
                  </div>
                  <div className="text-xs text-[#19322F]/70 dark:text-gray-300 truncate">
                    {ur.email ?? '—'}
                  </div>
                  <div className="mt-1 text-[9px] px-2 py-0.5 inline-block bg-black/5 dark:bg-white/10 rounded text-[#19322F]/60 dark:text-white/50 font-medium">
                    ID: #{ur.userId.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    isAdmin
                      ? 'bg-[#006655] text-white'
                      : 'bg-gray-150 text-gray-700 dark:bg-white/10 dark:text-gray-200'
                  }`}
                >
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </span>
                <div className="flex items-center text-xs text-[#19322F]/60 dark:text-gray-400">
                  {ur.lastSignInAt ? (
                    <>
                      <span className="material-icons text-[14px] mr-1 text-[#006655] dark:text-[#D9ECC8]">
                        check_circle
                      </span>
                      Activo
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-[14px] mr-1 text-gray-400">
                        remove_circle_outline
                      </span>
                      Inactivo
                    </>
                  )}
                </div>
              </div>

              {/* Activity Info (Registrado + Último acceso) */}
              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/40 dark:text-white/40 font-semibold">
                    Registrado
                  </div>
                  <div className="text-sm font-semibold text-[#19322F] dark:text-white truncate">
                    {formatDate(ur.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/40 dark:text-white/40 font-semibold">
                    Último Acceso
                  </div>
                  <div className="text-sm font-semibold text-[#19322F] dark:text-white truncate">
                    {ur.lastSignInAt ? formatDate(ur.lastSignInAt) : '—'}
                  </div>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end">
                <RoleDropdown userId={ur.userId} currentRole={ur.role} />
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-[#152e2a] rounded-xl border border-[#19322F]/6 dark:border-white/6">
            <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-5xl mb-3 block">
              group
            </span>
            <p className="text-[#19322F]/40 dark:text-white/30 text-sm">
              No se encontraron usuarios.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useState, useTransition } from 'react';
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
    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#006655] flex items-center justify-center flex-shrink-0">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName ?? email ?? 'Usuario'}
          width={36}
          height={36}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-sm font-bold">{initials}</span>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        role === 'admin'
          ? 'bg-[#D9ECC8] text-[#19322F]'
          : 'bg-[#006655]/10 text-[#006655] dark:bg-[#006655]/20 dark:text-[#D9ECC8]'
      }`}
    >
      <span className="material-icons text-xs">
        {role === 'admin' ? 'shield' : 'person'}
      </span>
      {role === 'admin' ? 'Admin' : 'Usuario'}
    </span>
  );
}

function RoleSelector({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const handleChange = (newRole: UserRole) => {
    if (newRole === role) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.success) {
        setRole(newRole);
        setFeedback('success');
        setTimeout(() => setFeedback(null), 2000);
      } else {
        setFeedback('error');
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          id={`role-select-${userId}`}
          value={role}
          onChange={(e) => handleChange(e.target.value as UserRole)}
          disabled={isPending}
          className={`
            appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-lg border
            bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white
            border-[#19322F]/12 dark:border-white/10
            focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655]/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
            cursor-pointer
          `}
        >
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <span className="material-icons absolute right-1.5 top-1/2 -translate-y-1/2 text-[#19322F]/40 dark:text-white/30 text-xs pointer-events-none">
          expand_more
        </span>
      </div>

      {isPending && (
        <span className="material-icons animate-spin text-[#006655] text-sm">refresh</span>
      )}
      {feedback === 'success' && (
        <span className="material-icons text-emerald-500 text-sm animate-bounce-once">
          check_circle
        </span>
      )}
      {feedback === 'error' && (
        <span className="material-icons text-red-400 text-sm">error</span>
      )}
    </div>
  );
}

export function UsersTable({ userRoles }: UsersTableProps) {
  return (
    <section id="users" className="scroll-mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#19322F] dark:text-white">
            Usuarios
          </h2>
          <p className="text-sm text-[#19322F]/50 dark:text-white/40 mt-0.5">
            {userRoles.length} usuarios registrados
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#152e2a] rounded-2xl border border-[#19322F]/6 dark:border-white/6 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#19322F]/6 dark:border-white/6">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Rol actual
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Cambiar rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Último acceso
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Registrado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19322F]/4 dark:divide-white/4">
              {userRoles.map((ur) => (
                <tr
                  key={ur.userId}
                  className="hover:bg-[#EEF6F6]/60 dark:hover:bg-white/3 transition-colors duration-150"
                >
                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatarUrl={ur.avatarUrl}
                        displayName={ur.displayName}
                        email={ur.email}
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#19322F] dark:text-white leading-tight">
                          {ur.displayName ?? 'Sin nombre'}
                        </p>
                        <p className="text-xs text-[#19322F]/50 dark:text-white/40 mt-0.5">
                          {ur.email ?? '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Current role badge */}
                  <td className="px-6 py-4">
                    <RoleBadge role={ur.role} />
                  </td>

                  {/* Role editor */}
                  <td className="px-6 py-4">
                    <RoleSelector userId={ur.userId} currentRole={ur.role} />
                  </td>

                  {/* Last sign in */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#19322F]/60 dark:text-white/40">
                      {ur.lastSignInAt ? formatDate(ur.lastSignInAt) : '—'}
                    </span>
                  </td>

                  {/* Created at */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#19322F]/60 dark:text-white/40">
                      {formatDate(ur.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {userRoles.length === 0 && (
            <div className="py-16 text-center">
              <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-5xl mb-3 block">
                group
              </span>
              <p className="text-[#19322F]/40 dark:text-white/30 text-sm">
                No hay usuarios registrados aún.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

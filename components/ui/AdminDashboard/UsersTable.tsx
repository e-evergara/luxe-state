'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Image from 'next/image';
import { UserRoleRecord, UserRole } from '@/types/user';
import { updateUserRoleAction } from '@/app/admin/actions';

interface UsersTableProps {
  userRoles: UserRoleRecord[];
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
  userIndex: number;
}

function RoleDropdown({ userId, currentRole, userIndex }: RoleDropdownProps) {
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
        className="inline-flex items-center px-4 py-2 border border-gray-250 dark:border-gray-650 bg-white dark:bg-gray-800 shadow-sm text-xs font-semibold rounded-lg text-[#19322F] dark:text-gray-300 hover:bg-[#19322F] hover:text-white dark:hover:bg-white dark:hover:text-[#19322F] focus:outline-none transition-colors w-full md:w-auto justify-center cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <span className="material-icons text-xs animate-spin mr-1">refresh</span>
        ) : null}
        Change Role
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-[#006655] ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right border border-[#004d40]">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full group flex items-center px-4 py-3 text-xs text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors ${
                role === 'admin' ? 'bg-white/10 text-white font-semibold' : ''
              }`}
            >
              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">shield</span>
              Administrator
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className={`w-full group flex items-center px-4 py-3 text-xs text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors ${
                role === 'user' && userIndex !== 0 ? 'bg-white/10 text-white font-semibold' : ''
              }`}
            >
              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">business_center</span>
              Broker
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className={`w-full group flex items-center px-4 py-3 text-xs text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors ${
                role === 'user' && userIndex === 0 ? 'bg-white/10 text-white font-semibold' : ''
              }`}
            >
              <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">support_agent</span>
              Agent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function UsersTable({ userRoles }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'agent' | 'broker' | 'admin'>('all');

  const filteredUsers = userRoles.filter((ur, index) => {
    const matchesSearch =
      (ur.displayName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ur.email ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const userIndex = index % 3;
    let matchesTab = true;
    if (activeTab === 'admin') {
      matchesTab = ur.role === 'admin';
    } else if (activeTab === 'agent') {
      matchesTab = ur.role === 'user' && userIndex === 0;
    } else if (activeTab === 'broker') {
      matchesTab = ur.role === 'user' && userIndex !== 0;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <section id="users" className="scroll-mt-8">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#19322F] dark:text-white">User Directory</h1>
          <p className="text-[#19322F]/60 dark:text-gray-400 mt-1 text-sm">Manage user access and roles for your properties.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-[#19322F]/40 group-focus-within:text-[#006655] text-xl">search</span>
            </div>
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-gray-800 text-[#19322F] dark:text-white shadow-sm placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:outline-none transition-all text-sm rounded-lg"
            />
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-[#006655] text-sm font-medium rounded-lg text-[#006655] dark:text-[#D9ECC8] bg-transparent hover:bg-[#006655]/5 focus:outline-none focus:ring-2 focus:ring-[#006655] transition-colors whitespace-nowrap cursor-pointer">
            <span className="material-icons text-lg mr-2">add</span> Add User
          </button>
        </div>
      </div>

      {/* Tabs list matching mockup */}
      <div className="mt-8 mb-6 flex gap-6 border-b border-[#19322F]/10 dark:border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-gray-400 hover:text-[#19322F]'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'agent'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-gray-400 hover:text-[#19322F]'
          }`}
        >
          Agents
        </button>
        <button
          onClick={() => setActiveTab('broker')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'broker'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-gray-400 hover:text-[#19322F]'
          }`}
        >
          Brokers
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'admin'
              ? 'text-[#006655] dark:text-[#D9ECC8] border-b-2 border-[#006655] dark:border-[#D9ECC8]'
              : 'text-[#19322F]/60 dark:text-gray-400 hover:text-[#19322F]'
          }`}
        >
          Admins
        </button>
      </div>

      {/* Grid Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#19322F]/50 dark:text-white/40 mb-3">
        <div className="col-span-4">User Details</div>
        <div className="col-span-3">Role &amp; Status</div>
        <div className="col-span-3">Performance</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredUsers.map((ur, idx) => {
          const isAdmin = ur.role === 'admin';
          const userIndex = idx % 3;
          
          // Match mockup performance values
          const mockProps = userIndex === 0 ? '8' : userIndex === 1 ? '14' : '24';
          const mockSales = userIndex === 0 ? '$1.8M' : userIndex === 1 ? '$3.1M' : '$4.2M';

          return (
            <div
              key={ur.userId}
              className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all duration-250 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                isAdmin
                  ? 'bg-[#D9ECC8]/20 dark:bg-[#006655]/10 border-[#006655]/20 dark:border-[#006655]/30'
                  : 'bg-white dark:bg-[#152e2a] border-gray-100 dark:border-gray-800 hover:bg-[#D9ECC8]/10 dark:hover:bg-[#006655]/5'
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
                  <div className="mt-1 text-[9px] px-2 py-0.5 inline-block bg-black/5 dark:bg-white/10 rounded text-[#19322F]/60 dark:text-white/50 font-semibold">
                    ID: #{ur.userId.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    isAdmin
                      ? 'bg-[#19322F] dark:bg-white text-white dark:text-[#19322F]'
                      : userIndex === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      : 'bg-[#006655]/10 dark:bg-[#006655]/20 text-[#006655] dark:text-[#D9ECC8]'
                  }`}
                >
                  {isAdmin ? 'Administrator' : userIndex === 0 ? 'Agent' : 'Senior Broker'}
                </span>
                <div className="flex items-center text-xs text-[#19322F]/60 dark:text-gray-400">
                  {ur.lastSignInAt ? (
                    <>
                      <span className="material-icons text-[14px] mr-1 text-[#006655] dark:text-[#D9ECC8]">
                        check_circle
                      </span>
                      Active
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-[14px] mr-1 text-gray-400">
                        schedule
                      </span>
                      Away
                    </>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                {isAdmin ? (
                  <>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400">Properties</div>
                      <div className="text-sm font-semibold text-[#19322F] dark:text-white">-</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400">Access Level</div>
                      <div className="text-sm font-semibold text-[#19322F] dark:text-white">Level 5</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Properties</div>
                      <div className="text-sm font-semibold text-[#19322F] dark:text-white">{mockProps}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Sales (YTD)</div>
                      <div className="text-sm font-semibold text-[#19322F] dark:text-white">{mockSales}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Dropdown */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end">
                <RoleDropdown userId={ur.userId} currentRole={ur.role} userIndex={userIndex} />
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-[#152e2a] rounded-xl border border-gray-200 dark:border-gray-800">
            <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-5xl mb-3 block">
              group
            </span>
            <p className="text-[#19322F]/40 dark:text-white/30 text-sm">
              No users found.
            </p>
          </div>
        )}
      </div>

      {/* Footer / Pagination matching mockup styling */}
      <footer className="mt-8 border-t border-gray-150 dark:border-[#006655]/20 bg-gray-50/50 dark:bg-[#006655]/5 py-6 px-4 rounded-xl flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-[#19322F] dark:text-white">1</span> to <span className="font-semibold text-[#19322F] dark:text-white">{filteredUsers.length}</span> of <span className="font-semibold text-[#19322F] dark:text-white">{userRoles.length}</span> users
            </p>
          </div>
          <div>
            <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-none -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-400 hover:text-[#006655] transition-colors cursor-pointer">
                <span className="sr-only">Previous</span>
                <span className="material-icons text-xl">chevron_left</span>
              </button>
              <button className="z-10 bg-[#006655] text-white relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md mx-1 shadow-sm cursor-pointer">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-400 hover:text-[#006655] transition-colors cursor-pointer">
                <span className="sr-only">Next</span>
                <span className="material-icons text-xl">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </section>
  );
}

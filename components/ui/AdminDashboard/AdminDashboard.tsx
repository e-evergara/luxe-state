import { Property } from '@/types/property';
import { UserRoleRecord } from '@/types/user';
import { PropertiesTable } from './PropertiesTable';
import { UsersTable } from './UsersTable';

interface AdminDashboardProps {
  properties: Property[];
  userRoles: UserRoleRecord[];
  activeTab: 'properties' | 'users';
}

export function AdminDashboard({ properties, userRoles, activeTab }: AdminDashboardProps) {
  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      {activeTab === 'properties' ? (
        <div className="animate-fade-in">
          <PropertiesTable properties={properties} />
        </div>
      ) : (
        <div className="animate-fade-in">
          <UsersTable userRoles={userRoles} />
        </div>
      )}
    </div>
  );
}

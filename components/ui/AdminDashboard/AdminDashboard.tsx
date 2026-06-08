import { Property } from '@/types/property';
import { UserRoleRecord } from '@/types/user';
import { StatsCard } from './StatsCard';
import { PropertiesTable } from './PropertiesTable';
import { UsersTable } from './UsersTable';

interface AdminDashboardProps {
  properties: Property[];
  userRoles: UserRoleRecord[];
  activeTab: 'properties' | 'users';
}

export function AdminDashboard({ properties, userRoles, activeTab }: AdminDashboardProps) {
  const totalActive = properties.filter((p) => p.status === 'active').length;
  const totalFeatured = properties.filter((p) => p.isFeatured).length;
  const totalAdmins = userRoles.filter((u) => u.role === 'admin').length;

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-[#19322F]/40 dark:text-white/30 mb-3 font-medium uppercase tracking-wider">
          <span className="material-icons text-xs">home</span>
          Panel de control
        </div>
        <h1 className="text-3xl font-bold text-[#19322F] dark:text-white mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-[#19322F]/50 dark:text-white/40">
          Gestiona las propiedades y los usuarios de LuxeEstate.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          icon="home_work"
          label="Total propiedades"
          value={properties.length}
          description={`${totalActive} activas`}
          accent="teal"
        />
        <StatsCard
          icon="check_circle"
          label="Propiedades activas"
          value={totalActive}
          accent="green"
        />
        <StatsCard
          icon="star"
          label="Destacadas"
          value={totalFeatured}
          description="En la portada"
          accent="amber"
        />
        <StatsCard
          icon="group"
          label="Total usuarios"
          value={userRoles.length}
          description={`${totalAdmins} admin${totalAdmins !== 1 ? 's' : ''}`}
          accent="sage"
        />
      </div>

      {/* Conditionally Render Properties or Users */}
      {activeTab === 'properties' ? (
        <div className="mb-10 animate-fade-in">
          <PropertiesTable properties={properties} />
        </div>
      ) : (
        <div className="mb-10 animate-fade-in">
          <UsersTable userRoles={userRoles} />
        </div>
      )}
    </div>
  );
}

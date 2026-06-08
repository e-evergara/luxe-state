'use client';

import { useState } from 'react';
import { Property } from '@/types/property';

interface PropertiesTableProps {
  properties: Property[];
}

const purposeLabels: Record<Property['purpose'], string> = {
  buy: 'Venta',
  rent: 'Arriendo',
};

const typeLabels: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  villa: 'Villa',
  penthouse: 'Penthouse',
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'buy' | 'rent'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Property['type']>('all');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPurpose = purposeFilter === 'all' || property.purpose === purposeFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;

    return matchesSearch && matchesPurpose && matchesType;
  });

  return (
    <section id="properties" className="scroll-mt-8">
      {/* Header and Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#19322F] dark:text-white">
            Propiedades
          </h2>
          <p className="text-sm text-[#19322F]/50 dark:text-white/40 mt-0.5">
            Gestiona el portafolio y supervisa su estado.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#19322F]/40 dark:text-white/30 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all"
            />
          </div>

          {/* Purpose Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value as 'all' | 'buy' | 'rent')}
            className="px-3 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all cursor-pointer"
          >
            <option value="all">Todos los propósitos</option>
            <option value="buy">En Venta</option>
            <option value="rent">En Arriendo</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | Property['type'])}
            className="px-3 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all cursor-pointer"
          >
            <option value="all">Todos los tipos</option>
            <option value="house">Casa</option>
            <option value="apartment">Apartamento</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#19322F]/6 dark:border-white/6 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-[#006655]/5 border-b border-[#19322F]/6 dark:border-white/6 text-xs font-semibold text-[#19322F]/50 dark:text-white/40 uppercase tracking-wider">
          <div className="col-span-6">Detalles de la Propiedad</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {/* Property Items */}
        <div className="divide-y divide-[#19322F]/6 dark:divide-white/6">
          {filteredProperties.map((property) => {
            const thumbnail = property.images[0]?.url;
            return (
              <div
                key={property.id}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#EEF6F6]/60 dark:hover:bg-[#006655]/5 transition-colors duration-150 items-center"
              >
                {/* Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-[#EEF6F6] dark:bg-white/5 border border-[#19322F]/6 dark:border-white/6">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-2xl">
                          home
                        </span>
                      </div>
                    )}
                    {property.isFeatured && (
                      <div className="absolute top-1 left-1 bg-amber-500 text-white rounded px-1.5 py-0.5 text-[8px] font-bold flex items-center gap-0.5 shadow-sm">
                        <span className="material-icons text-[8px]">star</span>
                        Destacada
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#19322F] dark:text-white group-hover:text-[#006655] dark:group-hover:text-[#D9ECC8] transition-colors cursor-pointer">
                      {property.title}
                    </h3>
                    <p className="text-xs text-[#19322F]/60 dark:text-white/40 mt-0.5 flex items-center gap-1">
                      <span className="material-icons text-xs text-[#19322F]/40 dark:text-white/30">location_on</span>
                      {property.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#19322F]/40 dark:text-white/30">
                      <span className="font-semibold text-[#006655] dark:text-[#D9ECC8] bg-[#006655]/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        {typeLabels[property.type]}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#19322F]/20 dark:bg-white/20"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bed</span>
                        {property.beds} {property.beds === 1 ? 'Hab' : 'Habs'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#19322F]/20 dark:bg-white/20"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bathtub</span>
                        {property.baths} {property.baths === 1 ? 'Baño' : 'Baños'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#19322F]/20 dark:bg-white/20"></span>
                      <span>{property.area} m²</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 md:col-span-2">
                  <div className="text-base font-bold text-[#19322F] dark:text-white">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-xs text-[#19322F]/50 dark:text-white/40 mt-0.5">
                    {property.purpose === 'rent' ? `${purposeLabels[property.purpose]} mensual` : purposeLabels[property.purpose]}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-6 md:col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      property.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-500/10 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/20'
                        : property.status === 'inactive'
                        ? 'bg-amber-50 text-amber-700 border-amber-500/10 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/20'
                        : 'bg-gray-100 text-gray-600 border-gray-500/10 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        property.status === 'active'
                          ? 'bg-emerald-500'
                          : property.status === 'inactive'
                          ? 'bg-amber-500'
                          : 'bg-gray-400'
                      }`}
                    ></span>
                    {property.status === 'active'
                      ? 'Activa'
                      : property.status === 'inactive'
                      ? 'Inactiva'
                      : 'Archivada'}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    className="p-2 rounded-lg text-[#19322F]/40 dark:text-white/30 hover:text-[#006655] dark:hover:text-[#D9ECC8] hover:bg-[#006655]/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title="Editar Propiedad"
                  >
                    <span className="material-icons text-xl">edit</span>
                  </button>
                  <button
                    className="p-2 rounded-lg text-[#19322F]/40 dark:text-white/30 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Eliminar Propiedad"
                  >
                    <span className="material-icons text-xl">delete_outline</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProperties.length === 0 && (
            <div className="py-16 text-center">
              <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-5xl mb-3 block">
                home_work
              </span>
              <p className="text-[#19322F]/40 dark:text-white/30 text-sm">
                No se encontraron propiedades.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Info */}
        <div className="px-6 py-4 border-t border-[#19322F]/6 dark:border-white/6 flex items-center justify-between bg-gray-50/50 dark:bg-[#006655]/5">
          <div className="text-sm text-[#19322F]/50 dark:text-white/40">
            Mostrando <span className="font-semibold text-[#19322F] dark:text-white">{filteredProperties.length}</span> de <span className="font-semibold text-[#19322F] dark:text-white">{properties.length}</span> resultados
          </div>
        </div>
      </div>
    </section>
  );
}

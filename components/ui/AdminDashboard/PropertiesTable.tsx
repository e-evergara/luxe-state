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

const statusStyles: Record<Property['status'], string> = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  inactive: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400',
};

const statusLabels: Record<Property['status'], string> = {
  active: 'Activa',
  inactive: 'Inactiva',
  archived: 'Archivada',
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  return (
    <section id="properties" className="scroll-mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#19322F] dark:text-white">
            Propiedades
          </h2>
          <p className="text-sm text-[#19322F]/50 dark:text-white/40 mt-0.5">
            {properties.length} propiedades en total
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#152e2a] rounded-2xl border border-[#19322F]/6 dark:border-white/6 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#19322F]/6 dark:border-white/6">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Propósito
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#19322F]/40 dark:text-white/30 uppercase tracking-wider">
                  Destacada
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19322F]/4 dark:divide-white/4">
              {properties.map((property) => {
                const thumbnail = property.images[0]?.url;
                return (
                  <tr
                    key={property.id}
                    className="hover:bg-[#EEF6F6]/60 dark:hover:bg-white/3 transition-colors duration-150"
                  >
                    {/* Property */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#EEF6F6] dark:bg-white/5 flex-shrink-0">
                          {thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumbnail}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-lg">
                                home
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#19322F] dark:text-white leading-tight">
                            {property.title}
                          </p>
                          <p className="text-xs text-[#19322F]/50 dark:text-white/40 mt-0.5 flex items-center gap-1">
                            <span className="material-icons text-[10px]">location_on</span>
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#19322F]/70 dark:text-white/60">
                        {typeLabels[property.type]}
                      </span>
                    </td>

                    {/* Purpose */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.purpose === 'buy'
                            ? 'bg-[#D9ECC8] text-[#19322F]'
                            : 'bg-[#006655]/10 text-[#006655] dark:bg-[#006655]/20 dark:text-[#D9ECC8]'
                        }`}
                      >
                        {purposeLabels[property.purpose]}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#19322F] dark:text-white">
                        {formatPrice(property.price)}
                      </p>
                      {property.purpose === 'rent' && (
                        <p className="text-[10px] text-[#19322F]/40 dark:text-white/30">/mes</p>
                      )}
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-xs text-[#19322F]/50 dark:text-white/40">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-xs">bed</span>
                          {property.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-xs">bathtub</span>
                          {property.baths}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-xs">square_foot</span>
                          {property.area}m²
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[property.status]}`}
                      >
                        {statusLabels[property.status]}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-6 py-4">
                      {property.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          <span className="material-icons text-sm">star</span>
                          Sí
                        </span>
                      ) : (
                        <span className="text-xs text-[#19322F]/30 dark:text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {properties.length === 0 && (
            <div className="py-16 text-center">
              <span className="material-icons text-[#19322F]/20 dark:text-white/20 text-5xl mb-3 block">
                home_work
              </span>
              <p className="text-[#19322F]/40 dark:text-white/30 text-sm">
                No hay propiedades registradas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

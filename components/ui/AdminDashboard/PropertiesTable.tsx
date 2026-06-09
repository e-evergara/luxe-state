'use client';

import { useState } from 'react';
import { Property } from '@/types/property';

interface PropertiesTableProps {
  properties: Property[];
}

const typeLabels: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  villa: 'Villa',
  penthouse: 'Penthouse',
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'buy' | 'rent'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Property['type']>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPurpose = purposeFilter === 'all' || property.purpose === purposeFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;

    return matchesSearch && matchesPurpose && matchesType;
  });

  const totalListings = properties.length;
  const activeCount = properties.filter((p) => p.status === 'active').length;
  const pendingCount = properties.filter((p) => p.status === 'inactive' || p.status === 'archived').length;

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  return (
    <section id="properties" className="scroll-mt-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] dark:text-white tracking-tight">My Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-[#006655]/30 text-[#19322F] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#006655]/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer ${
              showFilters ? 'ring-2 ring-[#006655]/50 border-[#006655]' : ''
            }`}
          >
            <span className="material-icons text-base">filter_list</span> Filter
          </button>
          <button className="bg-[#006655] hover:bg-[#006655]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer">
            <span className="material-icons text-base">add</span> Add New Property
          </button>
        </div>
      </div>

      {/* Interactive Collapsible Filter Bar */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-[#006655]/25 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {/* Search bar */}
          <div className="relative w-full">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#19322F]/40 dark:text-white/30 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por título, ciudad..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all"
            />
          </div>

          {/* Purpose Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => {
              setPurposeFilter(e.target.value as 'all' | 'buy' | 'rent');
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all cursor-pointer"
          >
            <option value="all">Todos los propósitos</option>
            <option value="buy">En Venta</option>
            <option value="rent">En Arriendo</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as 'all' | Property['type']);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[#19322F]/12 dark:border-white/10 bg-white dark:bg-[#1a3833] text-[#19322F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006655]/30 focus:border-[#006655] transition-all cursor-pointer"
          >
            <option value="all">Todos los tipos</option>
            <option value="house">Casa</option>
            <option value="apartment">Apartamento</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listings</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655] dark:text-[#D9ECC8]">
            <span className="material-icons">apartment</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Properties</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] dark:bg-[#006655]/20 flex items-center justify-center text-[#006655] dark:text-[#D9ECC8]">
            <span className="material-icons">check_circle</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Sale</p>
            <p className="text-2xl font-bold text-[#19322F] dark:text-white mt-1">{pendingCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center text-orange-650 dark:text-orange-400">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-[#006655]/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-[#006655]/5 border-b border-gray-100 dark:border-[#006655]/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Property Items */}
        <div className="divide-y divide-gray-100 dark:divide-[#006655]/10">
          {paginatedProperties.map((property) => {
            const thumbnail = property.images[0]?.url;
            return (
              <div
                key={property.id}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#EEF6F6]/60 dark:hover:bg-[#006655]/5 transition-colors items-center bg-white dark:bg-[#152e2a]"
              >
                {/* Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-icons text-gray-400 dark:text-gray-500 text-2xl">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">{property.location}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <span className="font-semibold text-[#006655] dark:text-[#D9ECC8] bg-[#006655]/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        {typeLabels[property.type]}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bed</span> {property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bathtub</span> {property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>{property.area} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 md:col-span-2">
                  <div className="text-base font-semibold text-[#19322F] dark:text-white">
                    {formatPrice(property.price)}
                  </div>
                  {property.purpose === 'rent' && (
                    <div className="text-xs text-gray-400 mt-0.5">Monthly: {formatPrice(property.price)}</div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-6 md:col-span-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      property.status === 'active'
                        ? 'bg-[#D9ECC8] text-[#006655] border-[#006655]/10'
                        : property.status === 'inactive'
                        ? 'bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-400 border-gray-200 dark:border-gray-700/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        property.status === 'active'
                          ? 'bg-[#006655]'
                          : property.status === 'inactive'
                          ? 'bg-orange-500'
                          : 'bg-gray-500'
                      }`}
                    ></span>
                    {property.status === 'active'
                      ? 'Active'
                      : property.status === 'inactive'
                      ? 'Pending'
                      : 'Sold'}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-[#006655] dark:hover:text-[#D9ECC8] hover:bg-[#D9ECC8]/30 transition-all cursor-pointer">
                    <span className="material-icons text-xl">edit</span>
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer">
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
                No properties found.
              </p>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-150 dark:border-[#006655]/20 flex items-center justify-between bg-gray-50/50 dark:bg-[#006655]/5">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-[#19322F] dark:text-white">{filteredProperties.length === 0 ? 0 : startIndex + 1}</span> to <span className="font-semibold text-[#19322F] dark:text-white">{Math.min(endIndex, filteredProperties.length)}</span> of <span className="font-semibold text-[#19322F] dark:text-white">{filteredProperties.length}</span> results
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-[#006655]/30 rounded-md text-[#19322F] dark:text-gray-300 hover:bg-white dark:hover:bg-[#006655]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-[#006655]/30 rounded-md text-[#19322F] dark:text-gray-300 hover:bg-white dark:hover:bg-[#006655]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

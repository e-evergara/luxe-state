// ---------------------------------------------------------------------------
// PropertyImage — relational image for a property
// ---------------------------------------------------------------------------

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  title?: string;
  description?: string;
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

// ---------------------------------------------------------------------------
// Property — main entity
// ---------------------------------------------------------------------------

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number; // in m²
  tag?: string; // e.g. "Exclusive", "New Arrival"
  type: 'house' | 'apartment' | 'villa' | 'penthouse';
  purpose: 'buy' | 'rent';
  isFeatured: boolean;
  active: boolean;
  status: 'active' | 'inactive' | 'archived';
  images: PropertyImage[];
  latitude?: number;
  longitude?: number;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

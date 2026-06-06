export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number; // in m²
  image: string;
  tag?: string; // e.g. "Exclusive", "New Arrival"
  type: 'house' | 'apartment' | 'villa' | 'penthouse';
  purpose: 'buy' | 'rent';
  isFeatured: boolean;
}

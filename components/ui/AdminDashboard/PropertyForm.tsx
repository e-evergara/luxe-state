'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Property } from '@/types/property';
import { uploadPropertyImage } from '@/lib/supabase/storage';
import { savePropertyAction } from '@/app/admin/actions';

const PropertyMap = dynamic(() => import('./Map'), { ssr: false });

interface PropertyFormProps {
  property?: Property | null;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [title, setTitle] = useState(property?.title || '');
  const [price, setPrice] = useState(property?.price?.toString() || '');
  const [status, setStatus] = useState<'active' | 'inactive' | 'archived'>(property?.status || 'active');
  const [type, setType] = useState<Property['type']>(property?.type || 'house');
  const [purpose, setPurpose] = useState<Property['purpose']>(property?.purpose || 'buy');
  
  const [location, setLocation] = useState(property?.location || '');
  const [city, setCity] = useState(property?.city || '');
  const [zipCode, setZipCode] = useState(property?.zipCode || '');
  const [area, setArea] = useState(property?.area?.toString() || '');
  const [beds, setBeds] = useState(property?.beds || 0);
  const [baths, setBaths] = useState(property?.baths || 0);
  const [tag, setTag] = useState(property?.tag || '');
  const [isFeatured, setIsFeatured] = useState(property?.isFeatured || false);
  const [active, setActive] = useState(property?.active ?? true);
  const [latitude, setLatitude] = useState(property?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(property?.longitude?.toString() || '');

  // We keep a mix of existing image URLs and new File objects
  // For simplicity, we just store { url: string, file?: File }
  const [images, setImages] = useState<{ url: string; file?: File; preview?: string }[]>(
    property?.images.map(img => ({ url: img.url })) || []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        url: '',
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowSaveConfirm(false);
    setLoading(true);
    setError(null);

    try {
      // 1. Upload new images
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const url = await uploadPropertyImage(img.file, property?.id);
            return { url };
          }
          return { url: img.url };
        })
      );

      // 2. Prepare property data
      const propertyData = {
        title,
        price: Number(price),
        status,
        type,
        purpose,
        location,
        city: city.trim() || null,
        zipCode: zipCode.trim() || null,
        area: Number(area),
        beds,
        baths,
        tag,
        isFeatured,
        active,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      };

      // 3. Save via Server Action
      const result = await savePropertyAction(propertyData, uploadedImages, property?.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save property');
      }

      router.push('/admin/dashboard?tab=properties');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pb-24">
      <div className="xl:col-span-8 space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-[#19322F]">Basic Information</h2>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input 
                id="title" 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Modern Penthouse with Ocean View" 
                className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    id="price" 
                    type="number" 
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-medium font-sf-pro" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Status</label>
                <select 
                  id="status" 
                  value={status}
                  onChange={e => setStatus(e.target.value as Property['status'])}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Property Type</label>
                <select 
                  id="type" 
                  value={type}
                  onChange={e => setType(e.target.value as Property['type'])}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Purpose</label>
                <select 
                  id="purpose" 
                  value={purpose}
                  onChange={e => setPurpose(e.target.value as Property['purpose'])}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="tag" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">
                  Tag
                </label>
                <input 
                  id="tag" 
                  type="text" 
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  placeholder="e.g. Exclusive" 
                  className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro" 
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group mt-6">
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#006655] border-gray-300 rounded focus:ring-[#006655]" 
                />
                <span className="text-sm font-medium text-[#19322F] font-sf-pro transition-colors">Is Featured?</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group mt-6">
                <button
                  type="button"
                  onClick={() => setActive((prev) => !prev)}
                  title={active ? 'Desactivar propiedad' : 'Activar propiedad'}
                  aria-label={active ? 'Desactivar propiedad' : 'Activar propiedad'}
                  aria-pressed={active}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006655]"
                  style={{ backgroundColor: active ? '#006655' : '#D1D5DB' }}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                      active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-[#19322F] font-sf-pro transition-colors">Visible (Active)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#D9ECC8]/30 flex justify-between items-center bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F]">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-[#D9ECC8]/10 hover:border-[#006655]/40 transition-colors cursor-pointer group">
              <input 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#006655] group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-[#19322F] font-sf-pro">Click or drag images here</p>
                  <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview || img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#19322F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors z-20"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#006655] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                  )}
                </div>
              ))}
              
              {/* Fallback image placeholder if no images uploaded */}
              {images.length === 0 && (
                <div className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 transition-all">
                  <span className="material-icons text-3xl opacity-50 mb-2">home</span>
                  <span className="text-[10px] font-medium font-sf-pro uppercase text-center px-2">Default Image<br/>(Will be used)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F]">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Address / Location</label>
              <input 
                id="location" 
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Street Address, City" 
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">City</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Miami"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro"
                />
              </div>
              <div>
                <label htmlFor="zip_code" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">ZIP Code</label>
                <input
                  id="zip_code"
                  type="text"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  placeholder="e.g. 33101"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Latitude</label>
                <input 
                  id="latitude" 
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  placeholder="e.g. 19.4326" 
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro" 
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Longitude</label>
                <input 
                  id="longitude" 
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  placeholder="e.g. -99.1332" 
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro" 
                />
              </div>
            </div>

            {latitude !== '' && longitude !== '' && !isNaN(Number(latitude)) && !isNaN(Number(longitude)) && (
              <PropertyMap 
                latitude={Number(latitude)}
                longitude={Number(longitude)}
                onChange={(lat, lng) => {
                  setLatitude(lat.toString());
                  setLongitude(lng.toString());
                }}
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-gradient-to-r from-[#D9ECC8]/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F]">Details</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="group">
              <label htmlFor="area" className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block">Area (m²)</label>
              <input 
                id="area" 
                type="number" 
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="0" 
                className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-[#19322F] focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm" 
              />
            </div>
            
            <hr className="border-gray-100" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBeds(Math.max(0, beds - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={beds} className="w-10 text-center border-none bg-transparent text-[#19322F] p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => setBeds(beds + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBaths(Math.max(0, baths - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={baths} className="w-10 text-center border-none bg-transparent text-[#19322F] p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => setBaths(baths + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

      {/* Sticky Footer — always visible at bottom */}
      <div className="sticky bottom-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 -mb-10 mt-8 px-4 sm:px-6 lg:px-8 bg-white/90 dark:bg-[#19322F]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#006655]/30 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#006655] animate-pulse" />
                Guardando cambios...
              </span>
            ) : (
              <span>Los cambios no guardados se perderán al salir.</span>
            )}
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-[#006655]/40 bg-white dark:bg-transparent text-[#19322F] dark:text-gray-300 font-medium font-sf-pro hover:bg-gray-50 dark:hover:bg-[#006655]/10 transition-colors text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="property-form"
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-lg bg-[#006655] hover:bg-[#19322F] transition-all text-white font-medium font-sf-pro flex items-center gap-2 text-sm disabled:opacity-50 shadow-md shadow-[#006655]/20 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Property'}
              {!loading && <span className="material-icons text-sm">save</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Save Modal */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
        title="¿Guardar cambios?"
        message="¿Estás seguro de que deseas guardar los cambios para esta propiedad?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        confirmButtonBg="bg-[#006655] hover:bg-[#19322F] dark:hover:bg-[#006655]/80"
        confirmIcon="save"
        type="success"
      />

      {/* Confirm Cancel Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          router.push('/admin/dashboard?tab=properties');
        }}
        title="¿Descartar cambios?"
        message="Tienes cambios sin guardar. Si sales ahora, perderás toda la información ingresada."
        confirmText="Sí, salir"
        cancelText="Volver"
        confirmButtonBg="bg-red-600 hover:bg-red-700"
        confirmIcon="logout"
        type="warning"
      />
    </>
  );
}

// Reusable Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmButtonBg?: string;
  confirmIcon?: string;
  loading?: boolean;
  type?: 'warning' | 'success' | 'info';
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  confirmButtonBg = 'bg-[#006655] hover:bg-[#19322F]',
  confirmIcon,
  loading = false,
  type,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (!loading) onClose();
    };

    const handleClick = (e: MouseEvent) => {
      if (loading) return;
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [isOpen, onClose, loading]);

  const iconMap = {
    warning: { icon: 'warning_amber', bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-500' },
    info: { icon: 'info', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-500' },
    success: { icon: 'save', bg: 'bg-[#D9ECC8] dark:bg-[#006655]/20', text: 'text-[#19322F] dark:text-[#D9ECC8]' }
  };
  const typeConfig = type ? iconMap[type] : null;

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent border-0 focus:outline-none w-screen h-screen max-w-none max-h-none m-0 backdrop:bg-[#19322F]/40 backdrop:backdrop-blur-sm"
    >
      <div className={`bg-white dark:bg-[#0f231f] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#006655]/20 overflow-hidden transform transition-all duration-300 w-full max-w-md ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="h-1.5 bg-gradient-to-r from-[#D9ECC8] to-[#006655]" />
        
        <div className="p-6">
          {typeConfig && (
            <div className={`w-12 h-12 rounded-full ${typeConfig.bg} flex items-center justify-center ${typeConfig.text} mb-4`}>
              <span className="material-icons text-2xl">{typeConfig.icon}</span>
            </div>
          )}
          <h3 className="text-xl font-bold text-[#19322F] dark:text-white mb-2 font-sf-pro">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-sf-pro leading-relaxed">
            {message}
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-[#006655]/30 bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#006655]/10 transition-colors text-sm font-sf-pro disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 text-sm font-sf-pro shadow-md transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer ${confirmButtonBg}`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {confirmText}
                  {confirmIcon && <span className="material-icons text-sm">{confirmIcon}</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

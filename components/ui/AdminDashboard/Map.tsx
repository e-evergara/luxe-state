'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in Next.js environments
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  interactive?: boolean;
}

export default function Map({ latitude, longitude, onChange, interactive = true }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([latitude, longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      // Initialize marker
      const marker = L.marker([latitude, longitude], {
        draggable: interactive,
      }).addTo(map);

      markerRef.current = marker;

      if (interactive) {
        // Drag end handler
        marker.on('dragend', () => {
          if (markerRef.current) {
            const position = markerRef.current.getLatLng();
            // Round coordinates to 6 decimals for cleaner data
            const roundedLat = Math.round(position.lat * 1000000) / 1000000;
            const roundedLng = Math.round(position.lng * 1000000) / 1000000;
            onChange(roundedLat, roundedLng);
          }
        });

        // Map click handler
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          const roundedLat = Math.round(lat * 1000000) / 1000000;
          const roundedLng = Math.round(lng * 1000000) / 1000000;
          
          if (markerRef.current) {
            markerRef.current.setLatLng([roundedLat, roundedLng]);
          }
          onChange(roundedLat, roundedLng);
        });
      }
    } else {
      // Map and marker already exist, update marker position and pan if props changed
      if (markerRef.current) {
        const markerLatLng = markerRef.current.getLatLng();
        if (markerLatLng.lat !== latitude || markerLatLng.lng !== longitude) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
      }
      
      const currentCenter = mapRef.current.getCenter();
      if (currentCenter.lat !== latitude || currentCenter.lng !== longitude) {
        mapRef.current.setView([latitude, longitude]);
      }
    }
  }, [latitude, longitude, interactive, onChange]);

  // Map cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-4 z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-[2px] px-2.5 py-1 rounded shadow-sm text-[10px] font-medium text-[#19322F] pointer-events-none z-[1000] border border-gray-100 flex items-center gap-1 font-sf-pro">
        <span className="material-icons text-xs text-[#006655]">place</span>
        {latitude}, {longitude}
      </div>
    </div>
  );
}

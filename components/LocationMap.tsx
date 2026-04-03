// components/LocationMap.tsx
'use client';
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "@/lib/api";
import Image from "next/image";
import { MapPin } from 'lucide-react';

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const farmerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995572.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const grocerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2838/2838912.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Location {
  _id: string;
  type: 'farmer' | 'grocer';
  name: string;
  shopName?: string;
  address: string;
  coordinates: [number, number];
  avatar?: string;
  bio?: string;
  produceCount: number;
  followersCount: number;
}

interface LocationMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  showAllLocations?: boolean;
  singleLocation?: {
    id: string;
    type: 'farmer' | 'grocer';
    name: string;
    shopName?: string;
    address: string;
    coordinates: [number, number];
    avatar?: string;
  } | null;
}

const LocationMap = ({ 
  center = [28.6139, 77.2090], 
  zoom = 12, 
  height = "400px",
  showAllLocations = true,
  singleLocation = null
}: LocationMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  useEffect(() => {
    if (singleLocation) {
      
      setLocations([{
        _id: singleLocation.id,
        type: singleLocation.type,
        name: singleLocation.name,
        shopName: singleLocation.shopName,
        address: singleLocation.address,
        coordinates: singleLocation.coordinates,
        avatar: singleLocation.avatar,
        produceCount: 0,
        followersCount: 0,
      }]);
      setMapCenter(singleLocation.coordinates);
      setLoading(false);
      return;
    }

    if (!showAllLocations) {
      setLoading(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        const farmersRes = await api.get('/farmer/profile/');
        const farmers = farmersRes.success ? farmersRes.farmers : [];
        
        const grocersRes = await api.get('/grocer/profile/');
        const grocers = grocersRes.success ? grocersRes.grocers : [];
        
        const farmerLocations: Location[] = farmers
          .filter((farmer: { location?: { coordinates?: number[] } }) => farmer.location?.coordinates?.length === 2)
          .map((farmer: { 
            _id: string; 
            location?: { address?: string; coordinates: number[] }; 
            userId?: { fullName: string; avatar?: string }; 
            bio?: string; 
            produce?: unknown[]; 
            followers?: unknown[] 
          }) => ({
            _id: farmer._id,
            type: 'farmer' as const,
            name: farmer.userId?.fullName || 'Unknown Farmer',
            address: farmer.location?.address || 'Address not available',
            coordinates: farmer.location?.coordinates as [number, number],
            avatar: farmer.userId?.avatar,
            bio: farmer.bio,
            produceCount: farmer.produce?.length || 0,
            followersCount: farmer.followers?.length || 0,
          }));
       
        const grocerLocations: Location[] = grocers
          .filter((grocer: { location?: { coordinates?: number[] } }) => grocer.location?.coordinates?.length === 2)
          .map((grocer: { 
            _id: string; 
            location?: { address?: string; coordinates: number[] }; 
            shopName?: string; 
            userId?: { fullName: string; avatar?: string }; 
            bio?: string; 
            savedProduce?: unknown[]; 
            followers?: unknown[] 
          }) => ({
            _id: grocer._id,
            type: 'grocer' as const,
            name: grocer.shopName || grocer.userId?.fullName || 'Unknown Grocer',
            shopName: grocer.shopName,
            address: grocer.location?.address || 'Address not available',
            coordinates: grocer.location?.coordinates as [number, number],
            avatar: grocer.userId?.avatar,
            bio: grocer.bio,
            produceCount: grocer.savedProduce?.length || 0,
            followersCount: grocer.followers?.length || 0,
          }));
        
        const allLocations = [...farmerLocations, ...grocerLocations];
        setLocations(allLocations);
        
        if (allLocations.length > 0) {
          setMapCenter(allLocations[0].coordinates);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [showAllLocations, singleLocation]);

  const getIcon = (type: 'farmer' | 'grocer') => {
    return type === 'farmer' ? farmerIcon : grocerIcon;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-bg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-xs text-text-muted">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0 && !singleLocation) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-bg border border-border" style={{ height }}>
        <div className="text-center">
          <MapPin size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No locations available</p>
          <p className="text-xs text-text-muted mt-1">Add your location in settings to appear on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={mapCenter}
        zoom={zoom}
        ref={mapRef as React.RefObject<L.Map>}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={location.coordinates}
            icon={getIcon(location.type)}
          >
            <Popup>
              <div className="p-2 min-w-50">
                <div className="flex items-center gap-3 mb-2">
                  {location.avatar ? (
                    <Image
                      src={location.avatar} 
                      alt={location.name} 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                      {location.type === 'farmer' ? '🌾' : '🏪'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-primary text-sm">
                      {location.type === 'farmer' ? location.name : location.shopName || location.name}
                    </h4>
                    <p className="text-[10px] text-text-muted">
                      {location.type === 'farmer' ? '👨‍🌾 Farmer' : '🏪 Grocer'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-green mb-2 line-clamp-2">{location.bio}</p>
                <div className="flex items-center gap-1 text-[10px] text-text-muted mb-2">
                  <MapPin size={10} />
                  <span className="truncate">{location.address}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold mt-2 pt-2 border-t border-border">
                  <span>{location.produceCount} products</span>
                  <span>{location.followersCount} followers</span>
                </div>
                <a
                  href={`/features/${location.type}/${location._id}`}
                  className="block text-center mt-3 text-[10px] font-black uppercase tracking-wider bg-primary text-accent py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  View Profile →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
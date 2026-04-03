'use client';
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "@/lib/api";
import Image from "next/image";
import { MapPin, X, Star, Leaf, Store, Users, Package, ChevronRight, Heart } from 'lucide-react';

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const farmerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995572.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const grocerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2838/2838912.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
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
  produceCount?: number;
  followersCount?: number;
  rating?: number;
  isOrganic?: boolean;
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
  onLocationSelect?: (location: Location) => void;
}

const MapViewport = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LocationMap = ({ 
  center = [29.2188, 79.5199],
  zoom = 13,
  height = "400px",
  showAllLocations = true,
  singleLocation = null,
  onLocationSelect
}: LocationMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoverCardPosition, setHoverCardPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    
    if (singleLocation) {
       const swappedCoordinates: [number, number] = [
    singleLocation.coordinates[1],  
    singleLocation.coordinates[0]   
  ];
      const location: Location = {
        _id: singleLocation.id,
        type: singleLocation.type,
        name: singleLocation.name,
        shopName: singleLocation.shopName,
        address: singleLocation.address,
        coordinates: swappedCoordinates,
        avatar: singleLocation.avatar,
        produceCount: 0,
        followersCount: 0,
      };
      setLocations([location]);
      setMapCenter(swappedCoordinates);
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
            followers?: unknown[];
          }) => ({
            _id: farmer._id,
            type: 'farmer' as const,
            name: farmer.userId?.fullName || 'Unknown Farmer',
            address: farmer.location?.address || 'Address not available',
            coordinates: [farmer.location!.coordinates[1], farmer.location!.coordinates[0]] as [number, number],
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
            followers?: unknown[];
          }) => ({
            _id: grocer._id,
            type: 'grocer' as const,
            name: grocer.shopName || grocer.userId?.fullName || 'Unknown Grocer',
            shopName: grocer.shopName,
            address: grocer.location?.address || 'Address not available',
            coordinates: [grocer.location!.coordinates[1], grocer.location!.coordinates[0]] as [number, number],
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

  const handleMarkerHover = (location: Location, event: L.LeafletMouseEvent) => {
    setSelectedLocation(location);
    const container = mapRef.current?.getContainer();
    if (container) {
      const point = event.containerPoint;
      setHoverCardPosition({
        x: point.x + 20,
        y: point.y - 100
      });
    }
  };

  const handleMarkerLeave = () => {
    setSelectedLocation(null);
    setHoverCardPosition(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-bg-alt" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-text-muted">Loading map locations...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0 && !singleLocation) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-bg-alt border border-border" style={{ height }}>
        <div className="text-center p-8">
          <MapPin size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-lg font-bold text-primary mb-2">📍 Main Market, Haldwani</p>
          <p className="text-sm text-text-muted">Lat: 29.2188, Lon: 79.5199</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border shadow-lg" style={{ height }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={mapCenter}
        zoom={zoom}
        ref={mapRef as React.RefObject<L.Map>}
      >
        <MapViewport center={mapCenter} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={location.coordinates}
            icon={getIcon(location.type)}
            eventHandlers={{
              mouseover: (e) => handleMarkerHover(location, e),
              mouseout: handleMarkerLeave,
              click: () => onLocationSelect?.(location),
            }}
          />
        ))}
      </MapContainer>

      {selectedLocation && hoverCardPosition && (
        <div
          className="absolute z-[1000] animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: hoverCardPosition.y,
            left: hoverCardPosition.x,
            transform: 'translateX(-50%)',
            width: '320px',
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
            <div className={`relative p-4 ${selectedLocation.type === 'farmer' ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gradient-to-r from-cta to-cta/80'} text-white`}>
              <button onClick={handleMarkerLeave} className="absolute top-2 right-2 text-white/80 hover:text-white">
                <X size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                  {selectedLocation.avatar ? (
                    <Image src={selectedLocation.avatar} alt={selectedLocation.name} width={48} height={48} className="object-cover" />
                  ) : (
                    <span className="text-2xl">{selectedLocation.type === 'farmer' ? '🌾' : '🏪'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">
                    {selectedLocation.type === 'farmer' ? selectedLocation.name : selectedLocation.shopName || selectedLocation.name}
                  </h4>
                  <p className="text-[10px] text-white/80">
                    {selectedLocation.type === 'farmer' ? '👨‍🌾 Organic Farmer' : '🏪 Local Grocer'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-bg-alt rounded-lg p-2 text-center">
                  <Package size={14} className="mx-auto text-primary mb-1" />
                  <p className="text-lg font-black text-primary">{selectedLocation.produceCount || 0}</p>
                  <p className="text-[8px] font-bold uppercase text-text-muted">Products</p>
                </div>
                <div className="bg-bg-alt rounded-lg p-2 text-center">
                  <Users size={14} className="mx-auto text-primary mb-1" />
                  <p className="text-lg font-black text-primary">{selectedLocation.followersCount || 0}</p>
                  <p className="text-[8px] font-bold uppercase text-text-muted">Followers</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-text-muted mb-3 p-2 bg-bg-alt rounded-lg">
                <MapPin size={12} className="text-cta flex-shrink-0 mt-0.5" />
                <span className="text-xs line-clamp-2">{selectedLocation.address}</span>
              </div>

              {selectedLocation.bio && (
                <p className="text-xs text-text-green line-clamp-2 mb-3">{selectedLocation.bio}</p>
              )}

              <div className="flex gap-2">
                <a
                  href={`/features/${selectedLocation.type}/${selectedLocation._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-accent py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-primary-hover transition-all"
                >
                  View Profile <ChevronRight size={12} />
                </a>
                <button className="px-3 py-2 border border-border rounded-lg hover:bg-bg-alt transition-colors">
                  <Heart size={14} className="text-text-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg p-2 z-[500] border border-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${farmerIcon.options.iconUrl})`, backgroundSize: 'contain' }}></div>
            <span className="text-[10px] font-medium">Farmers</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-contain bg-no-repeat" style={{ backgroundImage: `url(${grocerIcon.options.iconUrl})`, backgroundSize: 'contain' }}></div>
            <span className="text-[10px] font-medium">Grocers</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg p-2 z-[500] border border-border">
        <div className="flex items-center gap-3">
          <div className="text-center px-2">
            <p className="text-lg font-black text-primary">{locations.length}</p>
            <p className="text-[8px] font-bold uppercase text-text-muted">Locations</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center px-2">
            <p className="text-lg font-black text-primary">{locations.filter(l => l.type === 'farmer').length}</p>
            <p className="text-[8px] font-bold uppercase text-text-muted">Farms</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center px-2">
            <p className="text-lg font-black text-primary">{locations.filter(l => l.type === 'grocer').length}</p>
            <p className="text-[8px] font-bold uppercase text-text-muted">Stores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
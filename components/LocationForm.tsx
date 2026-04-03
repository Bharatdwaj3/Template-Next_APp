// components/LocationForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Loader2, Leaf, Store, Upload, X, CheckCircle, Search, Navigation } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';

interface LocationFormProps {
  type: 'farmer' | 'grocer';
  profileId?: string;
  onSuccess?: () => void;
}

const LocationForm = ({ type, profileId, onSuccess }: LocationFormProps) => {
  const router = useRouter();
  const currentUser = useAppSelector((s) => s.avatar.user);
  
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [coordinatesStatus, setCoordinatesStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (profileId && currentUser) {
      setIsOwner(currentUser.id === profileId);
    } else if (currentUser) {
      setIsOwner(true);
    }
  }, [profileId, currentUser]);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!profileId) return;
      
      setFetching(true);
      try {
        const endpoint = type === 'farmer' ? `/farmer/profile/${profileId}` : `/grocer/profile/${profileId}`;
        const response = await api.get(endpoint);
        
        if (response.success && response[type]) {
          const data = response[type];
          if (data.location) {
            setAddress(data.location.address || '');
            if (data.location.coordinates && data.location.coordinates.length === 2) {
              setLongitude(data.location.coordinates[0].toString());
              setLatitude(data.location.coordinates[1].toString());
            }
          }
          if (data.mediaUrl) {
            setImagePreview(data.mediaUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch location data:', error);
      } finally {
        setFetching(false);
      }
    };
    
    fetchLocationData();
  }, [profileId, type]);

  const geocodeAddress = async () => {
    const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
    
    if (!fullAddress.trim()) {
      setMessage({ text: 'Please enter at least an address or city', type: 'error' });
      return false;
    }
    
    setGeocoding(true);
    setCoordinatesStatus('loading');
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
        setCoordinatesStatus('success');
        setMessage({ text: '📍 Location found! Coordinates added automatically.', type: 'success' });
        return true;
      } else {
        setCoordinatesStatus('error');
        setMessage({ text: 'Could not find location. Please be more specific with your address.', type: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setCoordinatesStatus('error');
      setMessage({ text: 'Failed to find location. Please check your address.', type: 'error' });
      return false;
    } finally {
      setGeocoding(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ text: 'Geolocation is not supported by your browser', type: 'error' });
      return;
    }
    
    setGeocoding(true);
    setCoordinatesStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setCoordinatesStatus('success');
        setMessage({ text: '📍 Current location captured!', type: 'success' });
        
        try {
          const reverseResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const reverseData = await reverseResponse.json();
          if (reverseData.display_name) {
            setAddress(reverseData.display_name.split(',')[0]);
            setCity(reverseData.city || reverseData.town || '');
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        }
        
        setGeocoding(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setMessage({ text: 'Failed to get location. Please enable GPS.', type: 'error' });
        setCoordinatesStatus('error');
        setGeocoding(false);
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!address && !city) {
      setMessage({ text: 'Please enter at least an address or city', type: 'error' });
      return;
    }
    
    if (!latitude || !longitude) {
      const geocoded = await geocodeAddress();
      if (!geocoded) return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
      formData.append('address', fullAddress);
      formData.append('coordinates', JSON.stringify([parseFloat(longitude), parseFloat(latitude)]));
      formData.append('landmark', landmark);
      formData.append('city', city);
      formData.append('pincode', pincode);
      
      if (image) formData.append('image', image);
      
      let response;
      if (profileId) {
        const endpoint = type === 'farmer' ? `/farmer/profile/${profileId}` : `/grocer/profile/${profileId}`;
        response = await api.put(endpoint, formData);
      } else {
        const endpoint = type === 'farmer' ? '/farmer/profile' : '/grocer/profile';
        response = await api.post(endpoint, formData);
      }
      
      if (response.success) {
        setMessage({ text: ` ${type === 'farmer' ? 'Farm' : 'Store'} location saved successfully!`, type: 'success' });
        
        if (!profileId) {
          setAddress('');
          setCity('');
          setPincode('');
          setLandmark('');
          setLatitude('');
          setLongitude('');
          setImage(null);
          setImagePreview(null);
          setCoordinatesStatus('idle');
        }
        
        if (onSuccess) onSuccess();
        
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessage({ text: response.message || 'Failed to save location', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving location:', error);
      setMessage({ text: 'Failed to save location', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isOwner && profileId) {
    return (
      <div className="bg-bg-alt border border-border rounded-xl p-8 text-center">
        <MapPin size={48} className="mx-auto text-text-muted mb-4" />
        <p className="text-text-muted">You don&apos;t have permission to edit this location.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-alt rounded-xl border border-border overflow-hidden">
      <div className={`p-6 ${type === 'farmer' ? 'bg-primary/5' : 'bg-cta/5'}`}>
        <div className="flex items-center gap-3 mb-2">
          {type === 'farmer' ? (
            <Leaf size={24} className="text-primary" />
          ) : (
            <Store size={24} className="text-cta" />
          )}
          <h2 className="text-xl font-black text-primary uppercase tracking-tight">
            {type === 'farmer' ? 'Farm Location' : 'Store Location'}
          </h2>
        </div>
        <p className="text-sm text-text-muted">
          Enter your address - coordinates will be added automatically
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
            {message.text}
          </div>
        )}
        
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
            Street Address *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
            placeholder="House number, street name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
              placeholder="Nearby landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
              City / Town *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
              placeholder="e.g., Dehradun"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
              PIN Code
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary text-sm"
              placeholder="6 digit code"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-bg rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-primary">
              Location Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={useCurrentLocation}
                className="text-[10px] font-bold text-cta hover:underline flex items-center gap-1"
              >
                <Navigation size={12} /> Use My Location
              </button>
              <button
                type="button"
                onClick={geocodeAddress}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Search size={12} /> Find from Address
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {coordinatesStatus === 'loading' && (
              <>
                <Loader2 size={14} className="animate-spin text-primary" />
                <span className="text-xs text-text-muted">Finding coordinates from your address...</span>
              </>
            )}
            {coordinatesStatus === 'success' && (
              <>
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs text-text-green">✓ Location found! Coordinates added automatically.</span>
              </>
            )}
            {coordinatesStatus === 'error' && (
              <>
                <X size={14} className="text-red-500" />
                <span className="text-xs text-red-500">Could not find location. Please be more specific.</span>
              </>
            )}
            {coordinatesStatus === 'idle' && !latitude && (
              <span className="text-xs text-text-muted">
                Coordinates will be added automatically when you save
              </span>
            )}
            {latitude && longitude && coordinatesStatus !== 'loading' && (
              <span className="text-[9px] text-text-muted">
                📍 {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
              </span>
            )}
          </div>
        </div>
        
        

        
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
            Store/Farm Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-bg transition-colors">
              <Upload size={16} className="text-primary" />
              <span className="text-xs font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || geocoding}
          className="w-full flex items-center justify-center gap-2 bg-primary text-accent py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {loading || geocoding ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          {loading ? 'Saving...' : geocoding ? 'Finding location...' : 'Save Location'}
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, MapPin, CheckCircle, X, Navigation, Search, Store, Leaf } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditGrocerLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // This should be the GROCER document ID
  const currentUser = useAppSelector((s) => s.avatar.user);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coordinatesStatus, setCoordinatesStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [shopName, setShopName] = useState('');
  const [bio, setBio] = useState('');
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch existing grocer data using GROCER document ID
  useEffect(() => {
    const fetchGrocer = async () => {
      try {
        const response = await api.get(`/grocer/profile/${id}`);
        if (response.success && response.grocer) {
          const grocer = response.grocer;
          setShopName(grocer.shopName || '');
          setBio(grocer.bio || '');
          
          if (grocer.location?.address) {
            setAddress(grocer.location.address);
          }
          if (grocer.location?.coordinates && grocer.location.coordinates.length === 2) {
            setLongitude(grocer.location.coordinates[0].toString());
            setLatitude(grocer.location.coordinates[1].toString());
            setCoordinatesStatus('success');
          }
        }
      } catch (error) {
        console.error('Failed to fetch grocer:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchGrocer();
  }, [id]);

  // Auto-detect coordinates (same as before)
  const autoGeocodeAddress = useCallback(async () => {
    const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
    
    if (!fullAddress.trim() || fullAddress.length < 5) {
      return;
    }
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(async () => {
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
          setMessage({ text: '📍 Location detected automatically!', type: 'success' });
          
          setTimeout(() => {
            setMessage(prev => prev?.text === '📍 Location detected automatically!' ? null : prev);
          }, 3000);
        } else {
          if (coordinatesStatus === 'success') {
            setCoordinatesStatus('idle');
          }
        }
      } catch (error) {
        console.error('Auto-geocoding error:', error);
        if (coordinatesStatus === 'loading') {
          setCoordinatesStatus('error');
        }
      } finally {
        setGeocoding(false);
      }
    }, 1000);
  }, [address, landmark, city, pincode, coordinatesStatus]);

  useEffect(() => {
    autoGeocodeAddress();
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [address, landmark, city, pincode, autoGeocodeAddress]);

  const handleManualGeocode = async () => {
    const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
    
    if (!fullAddress.trim()) {
      setMessage({ text: 'Please enter at least an address or city', type: 'error' });
      return;
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
        setMessage({ text: '📍 Location found!', type: 'success' });
      } else {
        setCoordinatesStatus('error');
        setMessage({ text: 'Could not find location. Please be more specific.', type: 'error' });
      }
    } catch (error) {
      setCoordinatesStatus('error');
      setMessage({ text: 'Failed to find location. Please try again.', type: 'error' });
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
            const parts = reverseData.display_name.split(',');
            setAddress(parts[0] || '');
            setCity(reverseData.city || reverseData.town || parts[1] || '');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address && !city) {
      setMessage({ text: 'Please enter at least an address or city', type: 'error' });
      return;
    }
    
    if (!latitude || !longitude) {
      const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
      if (fullAddress.trim()) {
        setGeocoding(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            setLatitude(data[0].lat);
            setLongitude(data[0].lon);
          } else {
            setMessage({ text: 'Could not find location coordinates. Please be more specific.', type: 'error' });
            setGeocoding(false);
            return;
          }
        } catch (error) {
          setMessage({ text: 'Failed to find location. Please try again.', type: 'error' });
          setGeocoding(false);
          return;
        }
        setGeocoding(false);
      } else {
        setMessage({ text: 'Please enter an address to detect location', type: 'error' });
        return;
      }
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const fullAddress = [address, landmark, city, pincode].filter(Boolean).join(', ');
      const coordinates = [parseFloat(longitude), parseFloat(latitude)];
      
      // Update using the GROCER document ID
      const response = await api.put(`/grocer/profile/${id}`, {
        shopName: shopName,
        bio: bio,
        location: {
          address: fullAddress,
          coordinates: coordinates,
        },
      });
      
      if (response.success) {
        setMessage({ text: '✅ Store location saved successfully!', type: 'success' });
        setTimeout(() => {
          router.push(`/features/grocer/${id}`);
        }, 1500);
      } else {
        setMessage({ text: response.message || 'Failed to save location', type: 'error' });
      }
    } catch (error: any) {
      console.error('Error saving location:', error);
      setMessage({ text: error.message || 'Failed to save location', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg py-10">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href={`/features/grocer/${id}`}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tight">
                  Edit Store Location
                </h1>
                <p className="text-sm text-text-muted">
                  Enter your address - coordinates will be detected automatically
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-bg-alt rounded-2xl border border-border p-6 space-y-5">
            {/* Shop Name Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
                Store Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
                placeholder="e.g., Green Basket Store"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
                Store Description
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
                placeholder="Tell customers about your store..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Address Fields (same as before) */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
                Street Address / Shop Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
                placeholder="e.g., Main Market, Near City Center"
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
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
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
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
                  placeholder="e.g., Haldwani, Dehradun"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-primary mb-2">
                PIN Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary bg-white text-sm"
                placeholder="6 digit code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            {/* Location Status (same as before) */}
            <div className="bg-white rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-primary">
                  📍 Location Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="text-[10px] font-bold text-cta hover:underline flex items-center gap-1 px-2 py-1 rounded"
                  >
                    <Navigation size={12} /> Use My Location
                  </button>
                  <button
                    type="button"
                    onClick={handleManualGeocode}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 px-2 py-1 rounded"
                  >
                    <Search size={12} /> Find Location
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {coordinatesStatus === 'loading' && (
                  <>
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span className="text-xs text-text-muted">Detecting location from address...</span>
                  </>
                )}
                {coordinatesStatus === 'success' && (
                  <>
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs text-green-600">✓ Location detected! Ready to save.</span>
                  </>
                )}
                {coordinatesStatus === 'error' && (
                  <>
                    <X size={14} className="text-red-500" />
                    <span className="text-xs text-red-500">Could not detect location. Try being more specific.</span>
                  </>
                )}
                {coordinatesStatus === 'idle' && !latitude && (
                  <span className="text-xs text-text-muted">
                    ✨ Just type your address above - coordinates will appear automatically
                  </span>
                )}
                {latitude && longitude && coordinatesStatus !== 'loading' && (
                  <span className="text-[9px] text-text-muted bg-bg-alt px-2 py-1 rounded">
                    📍 {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <div className="flex items-start gap-2">
                <Leaf size={14} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Example</p>
                  <p className="text-xs text-text-muted mt-1">
                    Type <span className="font-medium text-primary">"Main Market, Haldwani"</span> and coordinates will be detected automatically
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || geocoding}
              className="w-full flex items-center justify-center gap-2 bg-primary text-accent py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || geocoding ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              {loading ? 'Saving...' : geocoding ? 'Detecting location...' : 'Save Store Location'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
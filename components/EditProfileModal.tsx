'use client';

import { useState, useRef } from 'react';
import { X, Plus, Trash2, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

type Role = 'buyer' | 'farmer' | 'grocer';

interface DeliveryAddress {
  label:   string;
  address: string;
}

interface EditProfileModalProps {
  role:      Role;
  profileId: string;
  initial: {
    bio?:               string;
    farmName?:          string;
    shopName?:          string;
    interests?:         string[];
    location?:          string;
    deliveryAddresses?: DeliveryAddress[];
  };
  onClose:   () => void;
  onSuccess: (updated: Record<string, unknown>) => void;
}

export default function EditProfileModal({
  role, profileId, initial, onClose, onSuccess,
}: EditProfileModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [bio,       setBio]       = useState(initial.bio       ?? '');
  const [farmName,  setFarmName]  = useState(initial.farmName  ?? '');
  const [shopName,  setShopName]  = useState(initial.shopName  ?? '');
  const [location,  setLocation]  = useState(initial.location  ?? '');
  const [interests, setInterests] = useState<string[]>(initial.interests ?? []);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(
    initial.deliveryAddresses ?? []
  );
  const [newInterest, setNewInterest] = useState('');
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [preview,     setPreview]     = useState<string | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const addInterest = () => {
    const val = newInterest.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
    }
    setNewInterest('');
  };

  const removeInterest = (i: number) =>
    setInterests(interests.filter((_, idx) => idx !== i));

  const addAddress = () =>
    setAddresses([...addresses, { label: '', address: '' }]);

  const removeAddress = (i: number) =>
    setAddresses(addresses.filter((_, idx) => idx !== i));

  const updateAddress = (i: number, field: keyof DeliveryAddress, val: string) =>
    setAddresses(addresses.map((a, idx) => idx === i ? { ...a, [field]: val } : a));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const formData = new FormData();
    if (bio)       formData.append('bio', bio);
    if (imageFile) formData.append('image', imageFile);

    if (role === 'farmer') {
      if (farmName) formData.append('farmName', farmName);
      interests.forEach((i) => formData.append('interests', i));
    }

    if (role === 'grocer') {
      if (shopName) formData.append('shopName', shopName);
      if (location) formData.append('location', location);
      interests.forEach((i) => formData.append('interests', i));
    }

    if (role === 'buyer') {
      formData.append('deliveryAddresses', JSON.stringify(addresses));
    }

    try {
      const res  = await fetch(`/api/${role}/${profileId}`, {
        method: 'PUT',
        body:   formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Something went wrong');
        return;
      }

      onSuccess(data[role] ?? data);
      onClose();
    } catch {
      setError('Network error — please try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1a3d2b]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#f5f0e8] rounded-2xl shadow-2xl border border-[#d4c9b0] overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">Edit</p>
            <p className="text-base font-black text-white uppercase">Your Profile</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} className="text-white/60" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">

          {/* Avatar upload */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Profile Image</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d4c9b0] bg-[#1a3d2b]/10 flex items-center justify-center shrink-0">
                {preview
                  ? <Image src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <Upload size={18} className="text-[#8a9a8e]" />
                }
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-[#d4c9b0] text-[#1a3d2b] hover:border-[#1a3d2b]/40 transition-colors"
              >
                Choose Image
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </div>
          </div>

          {/* farmName */}
          {role === 'farmer' && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Farm Name</p>
              <input
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-2.5 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
              />
            </div>
          )}

          {/* shopName */}
          {role === 'grocer' && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Shop Name</p>
              <input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-2.5 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
              />
            </div>
          )}

          {/* bio */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Bio</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-2.5 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40 resize-none"
            />
            <p className="text-[10px] text-[#8a9a8e] mt-1 text-right">{bio.length}/1000</p>
          </div>

          {/* location — grocer only */}
          {role === 'grocer' && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Location</p>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Haldwani, Uttarakhand"
                className="w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-2.5 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
              />
            </div>
          )}

          {/* interests — farmer + grocer */}
          {(role === 'farmer' || role === 'grocer') && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">
                {role === 'farmer' ? 'Specialties' : 'Interests'}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {interests.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#1a3d2b]/10 text-[#1a3d2b] border border-[#1a3d2b]/15">
                    {s}
                    <button onClick={() => removeInterest(i)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add one..."
                  className="flex-1 bg-white border border-[#d4c9b0] rounded-xl px-4 py-2 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
                />
                <button
                  onClick={addInterest}
                  className="px-3 py-2 rounded-xl bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#1a3d2b]/90 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* deliveryAddresses — buyer only */}
          {role === 'buyer' && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] mb-2">Delivery Addresses</p>
              <div className="space-y-3">
                {addresses.map((addr, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1.5">
                      <input
                        value={addr.label}
                        onChange={(e) => updateAddress(i, 'label', e.target.value)}
                        placeholder="Label (e.g. Home)"
                        className="w-full bg-white border border-[#d4c9b0] rounded-xl px-3 py-2 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
                      />
                      <input
                        value={addr.address}
                        onChange={(e) => updateAddress(i, 'address', e.target.value)}
                        placeholder="Full address"
                        className="w-full bg-white border border-[#d4c9b0] rounded-xl px-3 py-2 text-sm text-[#1a3d2b] focus:outline-none focus:border-[#1a3d2b]/40"
                      />
                    </div>
                    <button
                      onClick={() => removeAddress(i)}
                      className="p-2 mt-1 hover:bg-[#e86c2a]/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-[#e86c2a]" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAddress}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1a3d2b] border border-dashed border-[#d4c9b0] px-4 py-2 rounded-xl hover:border-[#1a3d2b]/40 transition-colors w-full justify-center"
                >
                  <Plus size={12} /> Add Address
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-[11px] font-black text-[#e86c2a] uppercase tracking-widest">{error}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#d4c9b0] flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl border border-[#d4c9b0] text-[#1a3d2b] hover:border-[#1a3d2b]/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#1a3d2b]/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
// app/features/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/hooks/useCartContext';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Truck, Loader2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  img: string;
  grower: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, total } = useCartContext();
  const user = useAppSelector((s) => s.avatar.user);
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get cart data from context or session storage
    if (cartItems.length > 0) {
      setItems(cartItems);
      setSubtotal(total);
    } else {
      // Try to get from session storage
      const storedCart = sessionStorage.getItem('checkoutCart');
      const storedTotal = sessionStorage.getItem('checkoutTotal');
      if (storedCart && storedTotal) {
        setItems(JSON.parse(storedCart));
        setSubtotal(parseFloat(storedTotal));
      } else {
        // No cart data, redirect to produce page
        router.push('/features/produce');
        return;
      }
    }
    setIsLoading(false);
  }, [cartItems, total, router]);

  useEffect(() => {
    // Pre-fill form with user data
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.fullName || '',
      }));
    }
  }, [user]);

  const delivery = 40;
  const grandTotal = subtotal + delivery;
  const isFormValid = form.name && form.phone && form.address && form.city && form.pincode;

  const handleProceedToPayment = () => {
    if (!isFormValid) {
      alert('Please fill all delivery details');
      return;
    }

    // Store delivery info for payment page
    sessionStorage.setItem('checkoutDeliveryInfo', JSON.stringify({
      name: form.name,
      phone: form.phone,
      address: `${form.address}, ${form.city}, ${form.pincode}`,
      city: form.city,
      pincode: form.pincode,
    }));
    
    sessionStorage.setItem('checkoutCustomerInfo', JSON.stringify({
      name: form.name,
      email: user?.email || '',
      phone: form.phone,
      address: `${form.address}, ${form.city}, ${form.pincode}`,
    }));

    // Navigate to payment page
    router.push('/features/checkout/payment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8a9a8e] mb-4">Your cart is empty</p>
          <Link href="/features/produce" className="text-[var(--color-cta)] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link 
          href="/features/produce" 
          className="inline-flex items-center gap-2 text-sm text-[#8a9a8e] hover:text-[var(--color-primary)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
        
        <h1 className="text-4xl font-black text-[var(--color-primary)] mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-lg font-black text-[var(--color-primary)] mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[var(--color-cta)]" /> Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-primary)] placeholder:text-[#a09880]"
                  />
                  <input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-primary)] placeholder:text-[#a09880]"
                  />
                </div>
                <input
                  placeholder="Street address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-primary)] placeholder:text-[#a09880]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-primary)] placeholder:text-[#a09880]"
                  />
                  <input
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-primary)] placeholder:text-[#a09880]"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-[var(--color-primary)]/5 rounded-xl p-4 mt-6 border border-[var(--color-primary)]/10">
                <Truck size={16} className="text-[var(--color-primary)] shrink-0" />
                <p className="text-[11px] text-[#4a5a4e]">
                  Delivery within <span className="font-black text-[var(--color-primary)]">2–4 hours</span> for orders before 12pm.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)] h-fit sticky top-24">
            <h2 className="text-lg font-black text-[var(--color-primary)] mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  {item.img && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-[var(--color-primary)]">{item.name}</p>
                    <p className="text-[10px] text-[#8a9a8e]">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8a9a8e]">Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a9a8e]">Delivery</span>
                <span>₹{delivery}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)] font-bold">
                <span className="text-[var(--color-primary)]">Total</span>
                <span className="text-xl text-[var(--color-cta)]">₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={!isFormValid}
              className="mt-6 w-full bg-[var(--color-primary)] text-[var(--color-primary-accent)] py-3 rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/features/checkout/payment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/hooks/useCartContext';
import { useAppSelector } from '@/store/hooks';
import PaymentButton from '@/components/PaymentButton';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { items: cartItems, total, clearCart } = useCartContext();
  const user = useAppSelector((s) => s.avatar.user);
  
  const [items, setItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get cart data
    if (cartItems.length > 0) {
      setItems(cartItems);
      setSubtotal(total);
    } else {
      const storedCart = sessionStorage.getItem('checkoutCart');
      const storedTotal = sessionStorage.getItem('checkoutTotal');
      if (storedCart && storedTotal) {
        setItems(JSON.parse(storedCart));
        setSubtotal(parseFloat(storedTotal));
      }
    }

    // Get delivery info
    const storedDelivery = sessionStorage.getItem('checkoutDeliveryInfo');
    const storedCustomer = sessionStorage.getItem('checkoutCustomerInfo');
    
    if (storedDelivery) {
      setDeliveryInfo(JSON.parse(storedDelivery));
    }
    if (storedCustomer) {
      setCustomerInfo(JSON.parse(storedCustomer));
    }

    if (!storedDelivery) {
      router.push('/features/checkout');
      return;
    }

    setIsLoading(false);
  }, [cartItems, total, router]);

  const delivery = 40;
  const grandTotal = subtotal + delivery;

  const handlePaymentSuccess = () => {
    clearCart();
    sessionStorage.removeItem('checkoutCart');
    sessionStorage.removeItem('checkoutTotal');
    sessionStorage.removeItem('checkoutDeliveryInfo');
    sessionStorage.removeItem('checkoutCustomerInfo');
    router.push('/features/order-success');
  };

  const handlePaymentFailure = (error: any) => {
    console.log('Payment failed:', error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
      </div>
    );
  }

  if (!deliveryInfo) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8a9a8e] mb-4">No delivery information found</p>
          <Link href="/features/checkout" className="text-[var(--color-cta)] hover:underline">
            Go back to Checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link 
          href="/features/checkout" 
          className="inline-flex items-center gap-2 text-sm text-[#8a9a8e] hover:text-[var(--color-primary)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Checkout
        </Link>
        


        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-lg font-black text-[var(--color-primary)] mb-4">Payment</h2>
            
            {!user ? (
              <div className="text-center py-8">
                <p className="text-[#4a5a4e] mb-4">Please login to complete payment</p>
                <Link
                  href="/features/auth/login"
                  className="inline-block bg-[var(--color-primary)] text-[var(--color-primary-accent)] px-6 py-2.5 rounded-xl font-bold"
                >
                  Login to Continue
                </Link>
              </div>
            ) : (

              <>

                <button
      onClick={() => alert('Test button works!')}
      className="w-full bg-blue-500 text-white py-3 rounded-xl mb-4 font-bold"
    >
      Test Button
    </button>
              
              
              <PaymentButton
                cartItems={items.map(item => ({
                  _id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  unit: item.unit,
                  img: item.img,
                }))}
                customerInfo={customerInfo || {
                  name: deliveryInfo.name,
                  email: user.email || '',
                  phone: deliveryInfo.phone,
                  address: deliveryInfo.address,
                }}
                amount={grandTotal}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
              </>

            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-lg font-black text-[var(--color-primary)] mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                    <span className="text-[10px] text-[#8a9a8e] ml-1">({item.unit})</span>
                  </span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8a9a8e]">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a9a8e]">Delivery</span>
                <span>₹{delivery}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)] font-bold">
                <span className="text-[var(--color-primary)]">Total</span>
                <span className="text-xl text-[var(--color-cta)]">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
          <h3 className="font-bold text-[var(--color-primary)] mb-2">Delivery Address</h3>
          <p className="text-sm text-[var(--color-primary)]">{deliveryInfo.name}</p>
          <p className="text-sm text-[#8a9a8e]">{deliveryInfo.address}</p>
          <p className="text-sm text-[#8a9a8e]">Phone: {deliveryInfo.phone}</p>
        </div>
      </div>
    </div>
  );
}
// components/PaymentButton.tsx

'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  cartItems: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    img?: string;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  amount: number;
  onSuccess?: () => void;
  onFailure?: (error: any) => void;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({
  cartItems,
  customerInfo,
  amount,
  onSuccess,
  onFailure,
  className = '',
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      if (!cartItems?.length) {
        throw new Error('Cart is empty!');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment gateway');
      }

      console.log('Creating order with:', { amount, cartItems, customerInfo });

      
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, cartItems, customerInfo }),
      });

      const orderData = await orderResponse.json();
      console.log('Order response:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Nerthus',
        description: `Payment for ${cartItems.length} items`,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone || '',
        },
        theme: {
          color: '#1a3d2b',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setIsLoading(false);
          },
        },
        handler: async (response: any) => {
          console.log('Payment success response:', response);
          
          
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              customerInfo,
              amount,
            }),
          });

          const verifyData = await verifyResponse.json();
          console.log('Verify response:', verifyData);

          if (verifyData.success) {
            if (onSuccess) onSuccess();
          } else {
            throw new Error(verifyData.message || 'Payment verification failed');
          }
          setIsLoading(false);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      if (onFailure) onFailure(error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] font-bold py-3 px-4 rounded-xl hover:bg-[#2a5a3b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <CreditCard size={20} />
      )}
      {isLoading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
    </button>
  );
}
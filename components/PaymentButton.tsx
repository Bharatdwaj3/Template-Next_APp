// components/PaymentButton.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handlePaymentSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      setPaymentStatus('loading');

      const verificationResult = await api.post('/payments/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        cartItems,
        customerInfo,
        amount,
      });

      if (verificationResult.success) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else {
        throw new Error(verificationResult.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.data?.message || error.message || 'Verification failed');
      if (onFailure) onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentFailure = async (response: any) => {
    try {
      console.log('Payment failed:', response);
      await api.post('/payments/failure', {
        order_id: response.error?.metadata?.order_id,
        payment_id: response.error?.metadata?.payment_id,
        error_code: response.error?.code,
        error_description: response.error?.description,
      });

      setPaymentStatus('error');
      setErrorMessage(response.error?.description || 'Payment failed');
      if (onFailure) onFailure(response.error);
    } catch (error) {
      console.error('Error handling payment failure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setPaymentStatus('loading');
      setErrorMessage('');

      if (!cartItems?.length) {
        throw new Error('Cart is empty!');
      }
      if (!customerInfo?.name || !customerInfo?.email) {
        throw new Error('Customer information is required!');
      }
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount!');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment gateway');
      }

      console.log('Creating order...', { amount, cartItems, customerInfo });
      
      const orderData = await api.post('/payments/create-order', { amount, cartItems, customerInfo });

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
          color: 'var(--color-primary)',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setIsLoading(false);
            setPaymentStatus('idle');
          },
        },
        handler: handlePaymentSuccess,
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', handlePaymentFailure);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setIsLoading(false);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed');
      if (onFailure) onFailure(error);
    }
  };

  const retryPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    handlePayment();
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (paymentStatus === 'success') return 'Payment Completed';
    return `Pay ₹${amount.toFixed(2)}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {paymentStatus === 'loading' && (
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-primary/10 text-primary rounded-lg">
          <Loader2 className="animate-spin" size={20} />
          <span>Processing payment...</span>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle size={20} />
          <span>Payment completed successfully!</span>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="flex items-center justify-between mb-4 p-3 bg-cta/10 text-cta rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle size={20} />
            <span>{errorMessage || 'Payment failed. Please try again.'}</span>
          </div>
          <button
            onClick={retryPayment}
            disabled={isLoading}
            className="text-sm font-medium text-cta hover:text-cta/80 underline"
          >
            Retry
          </button>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || paymentStatus === 'success'}
        className={`w-full flex items-center justify-center gap-2 text-text-inverse font-bold py-3 px-4 rounded-xl transition-all duration-300 ${
          paymentStatus === 'success'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-primary hover:bg-primary-hover'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : paymentStatus === 'success' ? (
          <CheckCircle size={20} />
        ) : (
          <CreditCard size={20} />
        )}
        {getButtonText()}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-text-muted">Secure payment powered by Razorpay</p>
        <p className="text-xs text-text-muted mt-1">
          We accept all major credit cards, debit cards, net banking, UPI & wallets
        </p>
      </div>
    </div>
  );
}
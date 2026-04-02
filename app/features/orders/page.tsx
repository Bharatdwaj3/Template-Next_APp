// app/features/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/payments/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'shipped': return <Truck size={16} className="text-blue-600" />;
      case 'delivered': return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[var(--color-primary)] mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package size={48} className="mx-auto text-[#8a9a8e] mb-4" />
            <h2 className="text-xl font-black text-[var(--color-primary)] mb-2">No Orders Yet</h2>
            <p className="text-[#8a9a8e] mb-6">Start shopping to see your orders here</p>
            <Link
              href="/features/produce"
              className="inline-block bg-[var(--color-primary)] text-[var(--color-primary-accent)] px-6 py-3 rounded-xl font-bold"
            >
              Browse Produce
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-[#8a9a8e]">Order #{order.orderId.slice(-8)}</p>
                    <p className="text-xs text-[#8a9a8e] mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="uppercase">{order.status}</span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-[#8a9a8e] mt-2">+ {order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <p className="text-sm text-[#8a9a8e]">Total Amount</p>
                    <p className="text-xl font-black text-[var(--color-cta)]">₹{order.totalAmount.toFixed(0)}</p>
                  </div>
                  <Link
                    href={`/features/orders/${order.orderId}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] rounded-xl text-sm font-bold hover:bg-[#e8e0d0] transition-colors"
                  >
                    <Eye size={16} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
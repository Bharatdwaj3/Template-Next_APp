'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { type CartItem } from './Cart';

interface CheckoutFormProps {
  items: CartItem[];
}

const STEPS = ['Delivery', 'Payment', 'Confirm'];

export const CheckoutForm = ({ items }: CheckoutFormProps) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', pincode: '',
    cardNumber: '', expiry: '', cvv: '',
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = 40;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    'w-full bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-2">Almost there</p>
        <h1 className="text-4xl font-black text-primary uppercase tracking-tight">Checkout</h1>
        <div className="w-12 h-0.5 mt-3" style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }} />
      </div>

      <div className="flex items-center gap-0 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                i === step
                  ? 'bg-primary text-accent'
                  : i < step
                  ? 'bg-accent/30 text-primary cursor-pointer'
                  : 'bg-bg-alt border border-border text-text-muted'
              }`}
            >
              {i < step ? <CheckCircle size={12} /> : null}
              {s}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 mx-1 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-cta" />
                  <h2 className="text-lg font-black text-primary uppercase tracking-tight">
                    Delivery Address
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
                  <input placeholder="Phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
                </div>
                <input placeholder="Street address" value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} />
                  <input placeholder="Pincode" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} className={inputClass} />
                </div>

                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <Truck size={16} className="text-primary shrink-0" />
                  <p className="text-[11px] text-text-green leading-relaxed">
                    Delivery within <span className="font-black text-primary">2–4 hours</span> for orders placed before 12pm. Fresh, direct from the farm.
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-cta" />
                  <h2 className="text-lg font-black text-primary uppercase tracking-tight">Payment</h2>
                </div>
                <input placeholder="Card number" value={form.cardNumber} onChange={(e) => update('cardNumber', e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM/YY" value={form.expiry} onChange={(e) => update('expiry', e.target.value)} className={inputClass} />
                  <input placeholder="CVV" value={form.cvv} onChange={(e) => update('cvv', e.target.value)} className={inputClass} />
                </div>
                <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <p className="text-[11px] text-text-green">
                    Your payment is secured with 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-primary uppercase tracking-tight mb-4">
                  Review Order
                </h2>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-[12px] font-black text-primary uppercase">{item.name}</p>
                      <p className="text-[10px] text-text-muted">x{item.quantity} · {item.grower}</p>
                    </div>
                    <p className="text-[13px] font-black text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="flex items-center justify-between mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-[11px] font-black uppercase tracking-widest text-text-green hover:text-primary transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => step < 2 ? setStep(step + 1) : alert('Order placed!')}
              className="ml-auto flex items-center gap-2 bg-primary text-accent text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              {step === 2 ? 'Place Order 🌿' : 'Continue →'}
            </button>
          </div>
        </div>

        <div className="col-span-5">
          <div className="bg-bg-alt border border-border rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-primary px-5 py-4">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/60">Summary</p>
              <p className="text-lg font-black text-text-inverse uppercase tracking-tight">Order Details</p>
            </div>
            <div className="p-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-[11px]">
                  <span className="text-text-green font-bold">{item.name} × {item.quantity}</span>
                  <span className="font-black text-primary">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-black text-primary">₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-text-muted">Delivery</span>
                  <span className="font-black text-primary">₹{delivery}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-[12px] font-black uppercase tracking-widest text-primary">Total</span>
                  <span className="text-xl font-black text-primary">₹{(total + delivery).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
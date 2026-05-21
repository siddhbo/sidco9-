import React, { useState } from 'react';
import { Property, FinancialProduct } from '../types';
import { Landmark as BrandIcon, Send as SendIcon, X as XIcon } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProperty?: Property | null;
  targetFinancial?: FinancialProduct | null;
  onSubmitInquiry: (name: string, email: string, phone: string, interest: string, message: string, propertyId?: string, propertyTitle?: string) => void;
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function InquiryModal({
  isOpen,
  onClose,
  targetProperty,
  targetFinancial,
  onSubmitInquiry,
  triggerToast
}: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen) return null;

  const defaultInterest = targetProperty
    ? `${targetProperty.region} Prop - ${targetProperty.category}`
    : targetFinancial
    ? `Financial - ${targetFinancial.type}`
    : 'Comprehensive Consultation';

  const defaultMessage = targetProperty
    ? `Hello, I would like to request more details regarding "${targetProperty.title}" located at ${targetProperty.location}. Specifically, I would like info on lease terms, payment structures, and NRI repatriable yield mechanics.`
    : targetFinancial
    ? `Hello! I would like to set up a consulting appointment in regards to your "${targetFinancial.name}" published portfolio provided by ${targetFinancial.provider}. Let me know standard compliance onboarding times.`
    : 'Hello, I would like to schedule a wealth planning consultation with the sidco9 Ventures cross-border advisory team.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      triggerToast('Name and Email are strictly required.', 'error');
      return;
    }

    const finalMsg = customMessage.trim() || defaultMessage;
    
    onSubmitInquiry(
      name.trim(),
      email.trim(),
      phone.trim(),
      defaultInterest,
      finalMsg,
      targetProperty?.id,
      targetProperty?.title || targetFinancial?.name
    );

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setCustomMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-black/10 animate-fade-in text-left">
        
        {/* Header decoration */}
        <div className="bg-black p-6 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <BrandIcon className="w-5 h-5 text-white" />
            <span className="font-bold text-sm tracking-widest uppercase">
              Inquiry Reservation
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          <div className="bg-[#F5F5F4] p-4 rounded-2xl border border-black/5 text-xs text-black text-left flex flex-col gap-1.5 font-sans font-medium">
            <span className="text-[9px] uppercase font-black text-black/50 tracking-widest">Inquired Portfolio:</span>
            {targetProperty && (
              <>
                <h5 className="font-bold text-sm uppercase tracking-tight text-black">{targetProperty.title}</h5>
                <p className="text-black/60 font-semibold">Location: {targetProperty.location}</p>
                <p className="font-mono text-black/40 font-bold">
                  Value From: {targetProperty.region === 'UAE' ? `AED ${targetProperty.price.toLocaleString('en-AE')}` : `₹${targetProperty.price.toLocaleString('en-IN')}`}
                  {targetProperty.yield && ` • Exp. Yield: ${targetProperty.yield}% p.a.`}
                </p>
              </>
            )}
            {targetFinancial && (
              <>
                <h5 className="font-bold text-sm uppercase tracking-tight text-black">{targetFinancial.name}</h5>
                <p className="text-black/60 font-semibold">Platform: {targetFinancial.provider}</p>
                <p className="font-mono text-black/40 font-bold">Service: {targetFinancial.type}</p>
              </>
            )}
            {!targetProperty && !targetFinancial && (
              <>
                <h5 className="font-bold text-sm uppercase tracking-tight text-black">Vetted Comprehensive Cross-Border Consulting</h5>
                <p className="text-black/60">Planning &amp; Setup for UAE Properties, Indian Mutual Funds, and Protect plans.</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5 font-sans">My Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Singhania"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3.5 bg-neutral-50/50 border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5 font-sans">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. vikram@singhania.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3.5 bg-neutral-50/50 border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5 font-sans">WhatsApp / Phone</label>
              <input
                type="tel"
                placeholder="e.g. +971-50-XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-3.5 bg-neutral-50/50 border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5 font-sans">Custom Requirements (Optional)</label>
            <textarea
              rows={3}
              placeholder={defaultMessage}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full text-xs p-4 bg-neutral-50/50 border border-black/10 rounded-2xl focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-850 text-white font-black py-4 rounded-full text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-101"
          >
            <SendIcon className="w-3.5 h-3.5" />
            Submit Instant Inquiry
          </button>

          <p className="text-[9px] text-black/40 font-mono text-center block mt-2 font-semibold">
            Advisory reply guaranteed within 1 business day.
          </p>
        </form>

      </div>
    </div>
  );
}

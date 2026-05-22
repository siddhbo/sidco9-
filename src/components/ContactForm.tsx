import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Clock, MapPin, Send, PhoneCall } from 'lucide-react';

interface ContactFormProps {
  prefilledText: string;
  prefilledInterest: string;
  onClearPrefill: () => void;
  onSubmitContactForm: (name: string, email: string, phone: string, interest: string, message: string) => void;
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function ContactForm({
  prefilledText,
  prefilledInterest,
  onClearPrefill,
  onSubmitContactForm,
  triggerToast
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');

  // Apply pre-filled states from SIP Calculator or Inquiries
  useEffect(() => {
    if (prefilledText) {
      setMessage(prefilledText);
    }
    if (prefilledInterest) {
      setInterest(prefilledInterest);
    }
  }, [prefilledText, prefilledInterest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !interest || !message) {
      triggerToast('All marked fields are strictly required.', 'error');
      return;
    }

    onSubmitContactForm(
      name.trim(),
      email.trim(),
      phone.trim(),
      interest,
      message.trim()
    );

    // Reset local inputs
    setName('');
    setEmail('');
    setPhone('');
    setInterest('');
    setMessage('');
    onClearPrefill();
  };

  return (
    <section className="py-20 bg-[#0A0A0A] text-white relative overflow-hidden" id="contact">
      {/* Light blurred decoration circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-block py-1 px-3 bg-white text-black text-[9px] font-black uppercase tracking-widest">
            Consultation Desk
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
            Initiate Wealth Engineering
          </h2>
          <div className="h-[1px] w-24 bg-white/20 mx-auto"></div>
          <p className="text-sm text-white/55 max-w-xl mx-auto font-semibold">
            Book a private cross-border advisor review. Our direct desk will respond with auditing models in exactly under 1 business day.
          </p>
        </div>

        {/* Form and Contact channels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Channel info boxes & contacts (5-span) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="font-bold text-2xl uppercase tracking-tight text-white">
              Advisory Headquarters
            </h3>
            
            <p className="text-sm text-white/60 leading-relaxed font-medium">
              Direct access channels for GCC residents and repatriated HNIs. Connect with an advisor immediately via WhatsApp premium desk logs or traditional emails.
            </p>

            <div className="space-y-4 pt-4">
              
              {/* WhatsApp Quick Link */}
              <a
                href="https://wa.me/919667498083"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-3xl bg-white/[0.04] border border-white/5 hover:border-emerald-500/35 flex items-center gap-4 hover:bg-white/[0.08] transition-all duration-300 block focus:outline-none shadow-sm"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] uppercase font-black tracking-wider text-white/40">Continuous Support</span>
                  <span className="font-mono text-sm font-bold text-white block">WhatsApp Business Hub</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">+91-9667498083</span>
                </div>
              </a>

              {/* Email link */}
              <a
                href="mailto:sidco9ventures@gmail.com"
                className="p-5 rounded-3xl bg-white/[0.04] border border-white/5 hover:border-white/20 flex items-center gap-4 hover:bg-white/[0.08] transition-all duration-300 block focus:outline-none shadow-sm"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] uppercase font-black tracking-wider text-white/40">Electronic Mail</span>
                  <span className="font-mono text-sm font-bold text-white block">Corporate Correspondence</span>
                  <span className="text-[10px] text-white/60 block font-mono">sidco9ventures@gmail.com</span>
                </div>
              </a>

              {/* Geographic Coordinates */}
              <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] uppercase font-black tracking-wider text-white/40">Dual Headquarters</span>
                  <span className="font-bold text-sm text-white block uppercase tracking-tight">India &bull; UAE Jurisdiction</span>
                  <span className="text-[10px] text-white/40 block leading-tight">Global compliance and fund gateways.</span>
                </div>
              </div>

              {/* Response SLA */}
              <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] uppercase font-black tracking-wider text-white/40">Response Guarantee</span>
                  <span className="font-bold text-sm text-white block uppercase tracking-tight">Under 24 Business Hours SLA</span>
                  <span className="text-[10px] text-white/40 block leading-tight">Prompt callback with compliance briefings.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Core Interactive Contact Form (7-span) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#F5F5F4] text-black p-8 rounded-3xl border border-black/5 shadow-2xl space-y-5 text-left font-sans">
            <h3 className="font-bold text-lg text-black uppercase tracking-tight border-b border-black/5 pb-4 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-black" />
              Wealth Alignment Brief
            </h3>

            {prefilledText && (
              <div className="p-3 bg-black text-[#F5F5F4] rounded-xl text-[10px] flex items-center justify-between font-mono">
                <span>Calculated target parameters attached.</span>
                <button
                  type="button"
                  onClick={onClearPrefill}
                  className="px-2.5 py-1 bg-white hover:bg-neutral-200 text-black rounded-lg text-[9px] font-black uppercase tracking-widest"
                  title="Clear parameters"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5">My Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Krishnan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3.5 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@krishnan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3.5 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5">WhatsApp / Contact (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +91-98765-43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3.5 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5">Primary Interest Category *</label>
                <div className="relative">
                  <select
                    required
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full text-xs p-3.5 bg-white border border-black/10 rounded-full focus:outline-none focus:border-black focus:bg-white transition-all font-bold font-sans text-black appearance-none pr-8"
                  >
                    <option value="">Choose planning vector...</option>
                    <option value="Insurance">Insurance Protection Planning</option>
                    <option value="Mutual Funds">NRI Mutual Fund Portfolios</option>
                    <option value="UAE Properties">UAE Real Estate Advisory</option>
                    <option value="Indian Properties">Premium Indian Properties</option>
                    <option value="Comprehensive Planning">Comprehensive Cross-Border Planning</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40 text-[10px]">▼</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-black/40 mb-1.5">Consultation Requirements &amp; Brief *</label>
              <textarea
                required
                rows={4}
                placeholder="Brief us on your timeline, financial allocations, or target goals."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-4 bg-white border border-[#ddd] rounded-2xl focus:outline-none focus:border-black focus:bg-white transition-all font-sans font-medium text-black leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-850 text-white font-black py-4 rounded-full text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-101"
            >
              <Send className="w-3.5 h-3.5" />
              Request Booking Call
            </button>

            <span className="text-[9.5px] text-black/40 font-mono text-center block mt-2">
              Submissions securely route to database and sidco9ventures@gmail.com
            </span>
          </form>

        </div>
      </div>
    </section>
  );
}

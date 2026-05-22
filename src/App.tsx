import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, MessageCircle, Mail, HelpCircle, CheckCircle2, ShieldX } from 'lucide-react';
import { FinancialProduct, Property, Inquiry } from './types';
import { DEFAULT_FINANCIAL_PRODUCTS, DEFAULT_PROPERTIES } from './data/defaultData';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesOverview from './components/ServicesOverview';
import FinancialSection from './components/FinancialSection';
import PropertiesSection from './components/PropertiesSection';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import InquiryModal from './components/InquiryModal';
import Logo from './components/Logo';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  // --- STATE PERSISTENCE CLIENT-SIDE PAINT ---
  const [financials, setFinancials] = useState<FinancialProduct[]>(() => {
    const local = localStorage.getItem('sidco9_financial');
    return local ? JSON.parse(local) : DEFAULT_FINANCIAL_PRODUCTS;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const local = localStorage.getItem('sidco9_properties');
    return local ? JSON.parse(local) : DEFAULT_PROPERTIES;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const local = localStorage.getItem('sidco9_inquiries');
    return local ? JSON.parse(local) : [];
  });

  // --- REAL-TIME FIRESTORE SYNC & SEED ENGINE ---
  useEffect(() => {
    // 1. Synchronize Financial portfolio documents
    const unsubscribeFinancials = onSnapshot(
      collection(db, 'financials'),
      async (snapshot) => {
        if (snapshot.empty) {
          // SEED DATABASE ON THE FIRST SESSION RUN
          try {
            console.log("Seeding financials collection...");
            const seedPromises = DEFAULT_FINANCIAL_PRODUCTS.map((f) =>
              setDoc(doc(db, 'financials', f.id), f)
            );
            await Promise.all(seedPromises);
          } catch (err) {
            console.error("Failed to seed financials:", err);
          }
        } else {
          const list: FinancialProduct[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as FinancialProduct);
          });
          setFinancials(list);
          localStorage.setItem('sidco9_financial', JSON.stringify(list));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'financials');
      }
    );

    // 2. Synchronize Property listings
    const unsubscribeProperties = onSnapshot(
      collection(db, 'properties'),
      async (snapshot) => {
        if (snapshot.empty) {
          // SEED DATABASE ON THE FIRST SESSION RUN
          try {
            console.log("Seeding properties collection...");
            const seedPromises = DEFAULT_PROPERTIES.map((p) =>
              setDoc(doc(db, 'properties', p.id), p)
            );
            await Promise.all(seedPromises);
          } catch (err) {
            console.error("Failed to seed properties:", err);
          }
        } else {
          const list: Property[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Property);
          });
          setProperties(list);
          localStorage.setItem('sidco9_properties', JSON.stringify(list));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'properties');
      }
    );

    // 3. Synchronize Inquiry Leads
    const unsubscribeInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        const list: Inquiry[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Inquiry);
        });
        // Sift entries sorted sequentially descending
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setInquiries(list);
        localStorage.setItem('sidco9_inquiries', JSON.stringify(list));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'inquiries');
      }
    );

    return () => {
      unsubscribeFinancials();
      unsubscribeProperties();
      unsubscribeInquiries();
    };
  }, []);

  // --- MODAL & PREFILL STATES ---
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedFinancial, setSelectedFinancial] = useState<FinancialProduct | null>(null);

  // Prefill states dedicated for the root ContactForm
  const [formPrefillText, setFormPrefillText] = useState('');
  const [formPrefilledInterest, setFormPrefilledInterest] = useState('');

  // --- TOAST FEEDBACK ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = 't-' + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- BUSINESS LOGIC ---
  const handlePropertyInquiryTrigger = (prop: Property) => {
    setSelectedFinancial(null);
    setSelectedProperty(prop);
    setIsInquiryOpen(true);
  };

  const handleFinancialInquiryTrigger = (prod: FinancialProduct) => {
    setSelectedProperty(null);
    setSelectedFinancial(prod);
    setIsInquiryOpen(true);
  };

  // Export SIP Planner parameters into the bottom Contact Form
  const handleExportSipToForm = (detailText: string, interestType: string) => {
    setFormPrefillText(detailText);
    setFormPrefilledInterest(interestType);
    triggerToast('Goal parameters successfully exported! Consultation form prefilled.', 'success');
    
    // Smooth scroll down to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const clearContactPrefills = () => {
    setFormPrefillText('');
    setFormPrefilledInterest('');
  };

  const handleSubmissionHandler = async (
    name: string,
    email: string,
    phone: string,
    interest: string,
    message: string,
    propertyId?: string,
    propertyTitle?: string
  ) => {
    const newInquiry: Inquiry = {
      id: 'inq-' + Date.now(),
      name,
      email,
      phone: phone || undefined,
      interest,
      message,
      timestamp: new Date().toISOString(),
      propertyId,
      propertyTitle
    };

    try {
      await setDoc(doc(db, 'inquiries', newInquiry.id), newInquiry);
      triggerToast('Inquiry securely recorded in permanent database. Our advisors will reach out shortly!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `inquiries/${newInquiry.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-brand-gold selection:text-brand-navy">
      
      {/* 1. STICKY HEADER */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        inquiriesCount={inquiries.length}
      />

      {/* 2. DYNAMIC PAGES VIEW */}
      <main className="flex-grow">
        <Hero />
        <ServicesOverview />
        
        {/* Insurance & Mutual Funds with CompPlanner Widget */}
        <FinancialSection
          financials={financials}
          onSelectFinancial={handleFinancialInquiryTrigger}
          onExportSipToContact={handleExportSipToForm}
        />

        {/* UAE & Indian Real Estate portfolios */}
        <PropertiesSection
          properties={properties}
          onSelectProperty={handlePropertyInquiryTrigger}
        />

        {/* Contact consultations form */}
        <ContactForm
          prefilledText={formPrefillText}
          prefilledInterest={formPrefilledInterest}
          onClearPrefill={clearContactPrefills}
          onSubmitContactForm={handleSubmissionHandler}
        />
      </main>

      {/* 3. FOOTER MATRICES */}
      <footer className="bg-brand-charcoal py-16 text-white/70 border-t border-white/5 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-white/10 pb-12 mb-12">
            
            {/* Branding Column */}
            <div className="lg:col-span-5 space-y-4">
              <a href="#home" className="inline-block group">
                <Logo size="md" lightText={true} />
              </a>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm font-light">
                Secure distribution partner offering vetted wealth protection and strategic compounding solutions across the India-GCC corridor. Preeminent UAE real estate advisory.
              </p>
              <div className="text-[10px] text-white/40 font-mono">
                Corporate compliance reference: SIDCO-IN-9AE1
              </div>
            </div>

            {/* Quick routes */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-gold">Solutions</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#insurance" className="hover:text-brand-gold transition-colors font-light">Insurance Protection</a></li>
                <li><a href="#mutual-funds" className="hover:text-brand-gold transition-colors font-light">Mutual Funds</a></li>
                <li><a href="#real-estate" className="hover:text-brand-gold transition-colors font-light">UAE Properties</a></li>
                <li><a href="#real-estate" className="hover:text-brand-gold transition-colors font-light">Indian Properties</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-gold">Corporate</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="hover:text-brand-gold transition-colors font-light">Services Matrix</a></li>
                <li><a href="#about" className="hover:text-brand-gold transition-colors font-light">About sidco9</a></li>
                <li><a href="#contact" className="hover:text-brand-gold transition-colors font-light">Direct Contact</a></li>
                <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-brand-gold text-left transition-colors font-light">Advisory CMS Login</button></li>
              </ul>
            </div>

            {/* Connectivity */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-gold">Headquarters</h4>
              <p className="text-xs font-light text-white/50 leading-loose">
                India &bull; UAE Dual Operations<br />
                SLA Helpline: +91-9667498083<br />
                Enquiry Desk: sidco9ventures@gmail.com
              </p>
            </div>

          </div>

          {/* Legal Declarations footer */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] text-white/40">
              <span>&copy; {new Date().getFullYear()} sidco9 Ventures. Independent Distribution Provider. All rights reserved.</span>
              <div className="flex gap-6 font-mono">
                <a href="#contact" className="hover:text-brand-gold transition-colors">Privacy Audits</a>
                <a href="#contact" className="hover:text-brand-gold transition-colors">Liability Exclusions</a>
                <a href="#contact" className="hover:text-brand-gold transition-colors">FEMA Controls</a>
              </div>
            </div>

            <p className="text-[9px] text-white/30 text-center border-t border-white/5 pt-4 leading-relaxed font-light">
              Disclaimer: sidco9 Ventures is an independent distributor of commercial real estate and vetted third-party financial assets. Real estate investments and mutual funds carry underlying asset valuation fluctuations and market risks. Historical return indices do not constitute a certified forecast or contract of future capital gains. Always review scheme details, prospectus audits, and title transfer compliance rules carefully.
            </p>
          </div>

        </div>
      </footer>

      {/* --- FLOATING HELPLINE SHORTCUT --- */}
      <a
        href="https://wa.me/919667498083"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-350 hover:scale-110 focus:outline-none ring-4 ring-emerald-400/20"
        title="Direct WhatsApp Helpline"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>

      {/* --- ADMIN CMS MASTER PANEL --- */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        financials={financials}
        setFinancials={setFinancials}
        properties={properties}
        setProperties={setProperties}
        inquiries={inquiries}
        setInquiries={setInquiries}
        triggerToast={triggerToast}
      />

      {/* --- RESERVATION INQUIRY MODAL --- */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        targetProperty={selectedProperty}
        targetFinancial={selectedFinancial}
        onSubmitInquiry={handleSubmissionHandler}
        triggerToast={triggerToast}
      />

      {/* --- CUSTOM INSTANT TOAST ALERTS --- */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl shadow-2xl border flex items-center gap-3 animate-fade-in pointer-events-auto shrink-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900 border-emerald-500/30 text-emerald-100'
                : 'bg-red-950 border-red-500/30 text-red-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldX className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs font-semibold leading-snug text-left">{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

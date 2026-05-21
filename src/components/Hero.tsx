import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Zap, Globe } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  const handleScrollToSegment = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#F5F5F4] overflow-hidden pt-24" id="home">
      {/* Structural luxury layout grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero information (7-span) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-block px-3 py-1 bg-black text-[#F5F5F4] text-[9px] font-black uppercase tracking-widest mb-2">
              v4.2 Wealth Deployment
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black leading-[0.88] tracking-tighter uppercase text-black">
              WEALTH<br/>ENGINEERED<span className="text-black/10">.</span>
            </h1>

            <p className="max-w-xl text-lg text-black/60 leading-relaxed font-medium">
              Insurance distribution &amp; NRI-compliant mutual funds tailored to protect and multiply your savings. Complemented by premier, developer-vetted UAE property acquisition advisory.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => handleScrollToSegment('real-estate')}
                className="px-8 py-3.5 bg-black hover:bg-neutral-850 text-white font-black rounded-full text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group"
              >
                Explore Active Shelf
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleScrollToSegment('contact')}
                className="px-8 py-3.5 bg-transparent hover:bg-black hover:text-white border border-black text-black font-black rounded-full text-[11px] uppercase tracking-widest transition-all duration-300"
              >
                Schedule Private Review
              </button>
            </div>

            {/* Micro-assurances links */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-black/10 max-w-lg">
              <div className="flex items-start gap-2">
                <div className="p-1 rounded bg-black/5 text-black mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs uppercase tracking-wider text-black">FEMA Guard</span>
                  <span className="text-[10px] text-black/40 block leading-tight">100% Compliant</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1 rounded bg-black/5 text-black mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs uppercase tracking-wider text-black">1-Day Hub</span>
                  <span className="text-[10px] text-black/40 block leading-tight">Response SLA</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1 rounded bg-black/5 text-black mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-xs uppercase tracking-wider text-black">Direct Curated</span>
                  <span className="text-[10px] text-black/40 block leading-tight">Prime Developers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aesthetic Luxury Card Visualizer Bento (5-span) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#0A0A0A] relative rounded-3xl p-8 shadow-2xl border border-white/5 overflow-hidden text-white flex flex-col justify-between aspect-[4/5] max-w-md mx-auto block">
              
              {/* Internal abstract vectors decor */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Card top branding */}
              <div className="flex justify-between items-start">
                <Logo size="sm" lightText={true} />

                <div className="bg-white/10 border border-white/10 px-2 py-1 rounded text-[8.5px] font-mono tracking-widest uppercase text-white/80">
                  Established Gateway
                </div>
              </div>

              {/* Decorative core visualization */}
              <div className="my-8 space-y-4">
                <div className="flex items-baseline justify-between text-left pb-2 border-b border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">Remittance Corridor</span>
                  <span className="text-[10px] font-mono text-white bg-white/10 px-1.5 py-0.5 rounded font-bold">AED &bull; INR</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-inner">
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block font-black">Insurance Coverage</span>
                      <span className="font-bold text-sm text-white">International Estate Wills</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">Vetted</span>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-inner">
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block font-black">Vetted Real Estate</span>
                      <span className="font-bold text-sm text-white">Dubai Yield Arbitrage</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/80 font-mono">High Yield</span>
                  </div>
                </div>
              </div>

              {/* Card bottom footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="block text-white/30 text-[8.5px] text-left">Dual Jurisdiction</span>
                  <span className="font-bold text-left text-white/90">IN &bull; UAE</span>
                </div>
                <div className="text-right">
                  <span className="block text-white/30 text-[8.5px] text-right">Audit compliance SLA</span>
                  <span className="font-bold text-white text-right font-mono text-[10px]">100% SECURE</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

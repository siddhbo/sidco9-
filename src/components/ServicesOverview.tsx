import React from 'react';
import { ShieldAlert, BarChart3, Building2, HelpCircle } from 'lucide-react';

export default function ServicesOverview() {
  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block py-1 px-3 bg-black text-[#F5F5F4] text-[9px] font-black uppercase tracking-widest">
            Services Matrix
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter leading-tight">
            Comprehensive Asset Distribution &amp; Advisory
          </h2>
          <div className="h-[1px] w-24 bg-black/10 mx-auto"></div>
          <p className="text-sm sm:text-base text-black/50 max-w-xl mx-auto leading-relaxed font-semibold">
            One unified partner in asset protection, equity growth, and premium real estate assets. Fully calibrated for cross-border Indian networks.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Insurance */}
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform duration-300">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-tight text-black">Insurance Distribution</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Strategic protection mapping leveraging elite domestic insurers. Structured to handle foreign nominee structures, non-resident premium payment routings, and absolute estate sovereignty compliance.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0A0A0A]/30">
              <span>Primary Protection Focus</span>
              <span className="text-black font-bold">IN-GCC Guard</span>
            </div>
          </div>

          {/* Card 2: Mutual funds */}
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-tight text-black">NRI Mutual Funds</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Unlock direct mutual fund deployment pathways. Benefit from fully automated NRI KYC onboarding, clear rupee-repatriable accounting, and tactical multi-asset capital compounding with premier AMCs.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0A0A0A]/30">
              <span>Global Portfolios</span>
              <span className="text-black font-bold">100% Tax-Efficient</span>
            </div>
          </div>

          {/* Card 3: UAE Real Estate */}
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform duration-300">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-tight text-black">Property Advisory</h3>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-medium">
                Direct advisory for luxury real estate across prime commercial and residential corridors in Dubai. We handpick developers based on balance-sheet audits, construction progress tracking, and true rental yield potential.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0A0A0A]/30">
              <span>Curated Shelf</span>
              <span className="text-black font-bold">Dubai &bull; India Prime</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

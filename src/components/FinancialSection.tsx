import React from 'react';
import { ShieldCheck, Coins, ArrowUpRight, Sparkles } from 'lucide-react';
import { FinancialProduct } from '../types';
import SipCalculator from './SipCalculator';

interface FinancialSectionProps {
  financials: FinancialProduct[];
  onSelectFinancial: (prod: FinancialProduct) => void;
  onExportSipToContact: (messageText: string, interestType: string) => void;
}

export default function FinancialSection({ financials, onSelectFinancial, onExportSipToContact }: FinancialSectionProps) {
  const insurances = financials.filter((f) => f.type === 'Insurance');
  const mutualFunds = financials.filter((f) => f.type === 'Mutual Fund');

  return (
    <div className="space-y-24 bg-[#F5F5F4]/30">
      
      {/* SECTION 1: INSURANCE */}
      <section className="py-20 bg-[#0A0A0A] text-white relative overflow-hidden" id="insurance">
        {/* Abstract decor backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block py-1 px-3 bg-white text-black text-[9px] font-black uppercase tracking-widest">
              Distribution Desk
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
              Insurance Solutions Vetted for GCC Expats
            </h2>
            <div className="h-[1px] w-24 bg-white/20 mx-auto"></div>
            <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed font-semibold">
              We distribute premium protection products specifically designed to bridge the regulatory and currency gaps for NRIs and Indian expats.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insurances.map((ins) => (
              <div
                key={ins.id}
                className="bg-white/5 border border-white/5 hover:border-white/20 rounded-3xl p-6 lg:p-8 flex flex-col justify-between text-left space-y-6 hover:bg-white/[0.08] transition-all duration-300 relative group"
              >
                {ins.badge && (
                  <span className="absolute top-4 right-4 bg-white/10 text-white border border-white/20 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full font-sans">
                    {ins.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl uppercase tracking-tight text-white group-hover:text-white/80 transition-colors">
                        {ins.name}
                      </h3>
                      <span className="text-[10px] text-white/40 block font-semibold uppercase tracking-wider">{ins.provider}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                    {ins.desc}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {(ins.features || []).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-white/65 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/30">Remittance Compliant</span>
                  <button
                    onClick={() => onSelectFinancial(ins)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-full text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-1 hover:scale-102"
                  >
                    Request Quote Setup
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {insurances.length === 0 && (
              <div className="text-center p-12 border border-dashed border-white/20 rounded-3xl col-span-2 text-white/40 text-sm">
                No active insurance products on catalog. Create products in the Admin Console.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION 2: MUTUAL FUNDS & SIP COMP compounding */}
      <section className="py-20 bg-white" id="mutual-funds">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-block py-1 px-3 bg-black text-[#F5F5F4] text-[9px] font-black uppercase tracking-widest">
              Accumulation Desk
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter leading-tight">
              NRI Mutual Funds &bull; Strategic Compounding
            </h2>
            <div className="h-[1px] w-24 bg-black/10 mx-auto"></div>
            <p className="text-sm sm:text-base text-black/50 max-w-xl mx-auto leading-relaxed font-semibold">
              We distribute premier Indian mutual fund listings with structured NRI KYC routing, tax-reconciliation audits, and currency hedge options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Products column */}
            <div className="space-y-6 text-left">
              <h3 className="font-bold text-xl text-black uppercase tracking-tight border-b border-black/5 pb-3 flex items-center gap-2">
                <Coins className="w-5 h-5 text-black" />
                Featured Distributions
              </h3>

              <div className="space-y-4">
                {mutualFunds.map((mf) => (
                  <div
                    key={mf.id}
                    className="p-6 border border-black/5 hover:border-black/15 rounded-3xl bg-[#F5F5F4]/30 hover:bg-white transition-all shadow-sm flex flex-col justify-between gap-4 text-left relative group font-sans"
                  >
                    {mf.badge && (
                      <span className="absolute top-4 right-4 bg-black text-[#F5F5F4] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full font-sans">
                        {mf.badge}
                      </span>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-bold text-lg text-black group-hover:text-black/80 transition-colors uppercase tracking-tight">
                        {mf.name}
                      </h4>
                      <span className="text-[10px] text-black/40 block font-semibold uppercase tracking-wider">{mf.provider}</span>
                      <p className="text-xs sm:text-sm text-black/60 font-medium leading-relaxed font-sans">
                        {mf.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 font-sans">
                      {(mf.features || []).map((feature, idx) => (
                        <span key={idx} className="bg-white border border-black/5 px-2.5 py-1 rounded-full text-[9px] font-bold text-black/60 shadow-sm uppercase tracking-wider">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-black/5 flex justify-between items-center mt-2 flex-wrap gap-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-black/30">Direct-Onboarding Plan</span>
                      <button
                        onClick={() => onSelectFinancial(mf)}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#0A0A0A] hover:text-black/60 transition-colors flex items-center gap-1 font-sans focus:outline-none bg-black/5 px-3 py-1.5 rounded-full text-left"
                      >
                        Initiate Strategy
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}

                {mutualFunds.length === 0 && (
                  <div className="text-center p-8 border border-dashed border-black/10 rounded-3xl text-black/40 text-xs">
                    No active mutual funds listed yet. Open Admin CMS to feed data.
                  </div>
                )}
              </div>
            </div>

            {/* Micro calculator widget planning column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-black font-semibold px-2 mb-2 text-lg uppercase tracking-wider">
                <Sparkles className="w-5 h-5 text-black animate-pulse text-left" />
                <span>Simulate Your Wealth Target</span>
              </div>
              <SipCalculator onExportToContact={onExportSipToContact} />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

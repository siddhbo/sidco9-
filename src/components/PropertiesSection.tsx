import React, { useState } from 'react';
import { MapPin, ArrowUpRight, Check } from 'lucide-react';
import { Property } from '../types';

interface PropertiesSectionProps {
  properties: Property[];
  onSelectProperty: (prop: Property) => void;
}

export default function PropertiesSection({ properties, onSelectProperty }: PropertiesSectionProps) {
  // Region filtering
  const uaeProps = properties.filter((p) => p.region === 'UAE');
  const indiaProps = properties.filter((p) => p.region === 'India');

  // Category filter states
  const [uaeFilter, setUaeFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [indiaFilter, setIndiaFilter] = useState<'All' | 'Residential' | 'Commercial'>('All');

  // Get active lists
  const filteredUae = uaeFilter === 'All' ? uaeProps : uaeProps.filter((p) => p.category === uaeFilter);
  const filteredIndia = indiaFilter === 'All' ? indiaProps : indiaProps.filter((p) => p.category === indiaFilter);

  // Helper to resolve card visual presets to modern minimalist high-contrast palettes
  const getGradientClass = (preset: string = '1') => {
    switch (preset) {
      case '1':
      case '2':
      case '5':
        // Obsidian Theme Card
        return 'bg-[#0A0A0A] border border-white/10 text-white';
      case '3':
      case '6':
        // Warm Stone Theme Card
        return 'bg-[#FAF9F5] border border-black/10 text-black';
      case '4':
      default:
        // Plain Architectural White Theme Card
        return 'bg-white border border-black/5 text-black';
    }
  };

  const formatPropPrice = (val: number, reg: 'UAE' | 'India') => {
    if (reg === 'UAE') {
      return `AED ${(val || 0).toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
    }
    return `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-24 bg-white" id="real-estate">
      
      {/* UAE PROPERTIES */}
      <section className="py-20 bg-[#F5F5F4]/40 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-black/10 pb-6">
            <div className="space-y-4">
              <div className="inline-block py-1 px-3 bg-black text-[#F5F5F4] text-[9px] font-black uppercase tracking-widest">
                Territory Shelf (UAE)
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                UAE Real Estate, Curated
              </h2>
              <p className="text-sm text-black/50 max-w-xl leading-relaxed font-semibold">
                Premium commercial towers and residential beachfront options in Dubai. Carefully selected for passive yield ratios and sovereign stability.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex bg-[#F5F5F4] border border-black/5 p-1 rounded-full self-start md:self-end">
              {(['All', 'Residential', 'Commercial'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUaeFilter(filter)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    uaeFilter === filter
                      ? 'bg-black text-white shadow-sm'
                      : 'text-black/50 hover:text-black'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* UAE Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUae.map((prop) => {
              const isDark = ['1', '2', '5'].includes(prop.gradient || '1');
              return (
                <div
                  key={prop.id}
                  className={`flex flex-col justify-between p-6 rounded-3xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${getGradientClass(
                    prop.gradient
                  )} text-left`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isDark ? 'bg-white/10 text-white' : 'bg-black text-[#F5F5F4]'
                      }`}>
                        {prop.category}
                      </span>
                      {prop.yield && (
                        <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600 font-extrabold'
                        }`}>
                          <Check className="w-3 h-3 block" />
                          {prop.yield}% Yield
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg tracking-tight line-clamp-2 leading-snug uppercase">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] opacity-75">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate font-semibold">{prop.location}</span>
                      </div>
                    </div>

                    {prop.type && (
                      <div className={`text-xs font-mono font-bold uppercase tracking-wide opacity-60`}>
                        Type: {prop.type}
                      </div>
                    )}

                    {/* Highlights chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(prop.highlights || []).map((hl, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold ${
                            isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#F2EADA]/40 border-black/5 text-black/80'
                          }`}
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/5 flex flex-col gap-3">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-widest opacity-60 font-black">Listing value from</span>
                      <span className="font-bold text-xl tracking-tight uppercase">
                        {formatPropPrice(prop.price, 'UAE')}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProperty(prop)}
                      className={`w-full py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 shadow-sm border hover:scale-102 ${
                        isDark
                          ? 'bg-white hover:bg-neutral-200 text-black border-white'
                          : 'bg-black hover:bg-neutral-800 text-white border-black'
                      }`}
                    >
                      Request Info Pack
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredUae.length === 0 && (
              <div className="text-center p-12 border border-dashed border-black/10 rounded-3xl col-span-1 sm:col-span-2 lg:col-span-4 text-black/50 text-sm font-semibold">
                No properties reported under this filters schema. Populate listings in the admin CMS.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* INDIAN PREMIUM PROPERTIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-black/10 pb-6">
            <div className="space-y-4">
              <div className="inline-block py-1 px-3 bg-black text-[#F5F5F4] text-[9px] font-black uppercase tracking-widest">
                Territory Shelf (India)
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                India Real Estate, Premium Picks
              </h2>
              <p className="text-sm text-black/50 max-w-xl leading-relaxed font-semibold">
                Premium managed office nodes, tech-park stakes, and sovereign luxury estates mapped for HNIs and NRIs worldwide.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex bg-[#F5F5F4] border border-black/5 p-1 rounded-full self-start md:self-end">
              {(['All', 'Residential', 'Commercial'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setIndiaFilter(filter)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    indiaFilter === filter
                      ? 'bg-black text-white shadow-sm'
                      : 'text-black/50 hover:text-black'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* India Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredIndia.map((prop) => {
              const isDark = ['1', '2', '5'].includes(prop.gradient || '1');
              return (
                <div
                  key={prop.id}
                  className={`flex flex-col justify-between p-6 rounded-3xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${getGradientClass(
                    prop.gradient
                  )} text-left`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isDark ? 'bg-white/10 text-white' : 'bg-black text-[#F5F5F4]'
                      }`}>
                        {prop.category}
                      </span>
                      {prop.yield && (
                        <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600 font-extrabold'
                        }`}>
                          <Check className="w-3 h-3 block" />
                          {prop.yield}% Yield
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg tracking-tight line-clamp-2 leading-snug uppercase">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] opacity-75">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate font-semibold">{prop.location}</span>
                      </div>
                    </div>

                    {prop.type && (
                      <div className={`text-xs font-mono font-bold uppercase tracking-wide opacity-60`}>
                        Type: {prop.type}
                      </div>
                    )}

                    {/* Highlights chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(prop.highlights || []).map((hl, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold ${
                            isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#F2EADA]/40 border-black/5 text-black/80'
                          }`}
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/5 flex flex-col gap-3">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-widest opacity-60 font-black">Investment from</span>
                      <span className="font-bold text-xl tracking-tight uppercase">
                        {formatPropPrice(prop.price, 'India')}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProperty(prop)}
                      className={`w-full py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 shadow-sm border hover:scale-102 ${
                        isDark
                          ? 'bg-white hover:bg-neutral-200 text-black border-white'
                          : 'bg-black hover:bg-neutral-800 text-white border-black'
                      }`}
                    >
                      Book Site Tour
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredIndia.length === 0 && (
              <div className="text-center p-12 border border-dashed border-black/10 rounded-3xl col-span-1 sm:col-span-2 lg:col-span-4 text-black/50 text-sm font-semibold">
                No premier Indian properties under this schema. Build the shelf in the admin CMS.
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

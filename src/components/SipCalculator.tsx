import React, { useState, useEffect } from 'react';
import { Compass, TrendingUp, IndianRupee, Landmark } from 'lucide-react';

interface SipCalculatorProps {
  onExportToContact: (messageText: string, interestType: string) => void;
}

export default function SipCalculator({ onExportToContact }: SipCalculatorProps) {
  const [currency, setCurrency] = useState<'AED' | 'INR'>('AED');
  const [monthlySip, setMonthlySip] = useState<number>(3000); // 3000 AED or 50,000 INR
  const [rateOfReturn, setRateOfReturn] = useState<number>(12); // e.g. 12%
  const [years, setYears] = useState<number>(15);
  const [goalType, setGoalType] = useState<string>('Dubai Property Downpayment');

  const EXCHANGE_RATE = 22.8; // 1 AED = 22.8 INR

  const formatCurrency = (val: number, cur: 'AED' | 'INR') => {
    if (cur === 'AED') {
      return `AED ${val.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
    }
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  // Synchronize monthly SIP when currency toggles to keep realistic baseline scale
  const handleCurrencyChange = (newCur: 'AED' | 'INR') => {
    if (newCur === 'INR' && currency === 'AED') {
      setMonthlySip(Math.round((monthlySip * EXCHANGE_RATE) / 1000) * 1000);
    } else if (newCur === 'AED' && currency === 'INR') {
      setMonthlySip(Math.max(500, Math.round((monthlySip / EXCHANGE_RATE) / 100) * 100));
    }
    setCurrency(newCur);
  };

  // SIP formula calculations: P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  // where i = monthly rate, n = number of months
  const monthlyRate = rateOfReturn / 12 / 100;
  const months = years * 12;
  
  let futureValue = 0;
  let totalInvested = monthlySip * months;
  
  if (monthlyRate > 0) {
    futureValue = monthlySip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  } else {
    futureValue = totalInvested;
  }

  const estWealthGained = Math.max(0, futureValue - totalInvested);
  const totalWealth = futureValue;

  // Percentage distribution
  const investedPercent = totalWealth > 0 ? (totalInvested / totalWealth) * 100 : 50;
  const gainPercent = totalWealth > 0 ? (estWealthGained / totalWealth) * 100 : 50;

  // SVG circular arc dash arrays
  const circ = 2 * Math.PI * 50; // Circumference of radius 50 circle = 314.16
  const investDash = circ * (investedPercent / 100);
  const gainDash = circ * (gainPercent / 100);

  const handleExport = () => {
    const detailString = `I planned my financial goal using the online tool:
- Goal Target: ${goalType}
- Desired Horizon: ${years} Years
- Allocation Model: ${formatCurrency(monthlySip, currency)} / month (${rateOfReturn}% expected annual return)
- Target Projection: ${formatCurrency(totalWealth, currency)} (Invested: ${formatCurrency(totalInvested, currency)}, Est. Gains: ${formatCurrency(estWealthGained, currency)})
I would like to consult on setting up this direct NRI-compliant investment channel.`;
    
    onExportToContact(detailString, 'Mutual Funds');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden" id="sip-planner">
      {/* Title Header */}
      <div className="bg-[#0A0A0A] p-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Landmark className="w-24 h-24 text-white" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-white/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Interactive Wealth Tool</span>
        </div>
        <h3 className="text-2xl font-bold tracking-tighter text-white mb-2 uppercase">GCC-NRI Strategic SIP Planner</h3>
        <p className="text-xs text-white/60 max-w-lg leading-relaxed">
          Determine monthly distributions required in multi-asset Mutual Funds to hit your target repatriation or property equity goals.
        </p>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Controls Panel - Left Grid */}
        <div className="md:col-span-7 space-y-6">
          {/* Target Goal Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-3">My Strategic Wealth Goal</label>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
              {[
                'Dubai Property Downpayment',
                'Child GCC Higher Ed Fund',
                'Repatriation Trust Corpus',
                'Tax-Optimized Growth Model',
                'Retirement Compounder'
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setGoalType(goal)}
                  className={`px-3 py-2 text-left rounded-lg text-xs font-semibold border transition-all ${
                    goalType === goal
                      ? 'bg-black text-white border-black shadow'
                      : 'bg-[#F5F5F4] hover:bg-[#EBEBE9] text-black/70 border-black/5'
                  }`}
                >
                  <span className="mr-1.5">
                    {goal === 'Dubai Property Downpayment' && '🏙️'}
                    {goal === 'Child GCC Higher Ed Fund' && '🎓'}
                    {goal === 'Repatriation Trust Corpus' && '⚖️'}
                    {goal === 'Tax-Optimized Growth Model' && '🛡️'}
                    {goal === 'Retirement Compounder' && '📈'}
                  </span>
                  {goal.split(' ')[0]} {goal.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div>
              <span className="block text-xs font-bold text-black uppercase tracking-wider">Base Planning Currency</span>
              <span className="text-[11px] text-gray-400">Fixed rate (1 AED = {EXCHANGE_RATE} INR)</span>
            </div>
            <div className="flex bg-[#EBEBE9] p-1 rounded-full border border-black/5">
              <button
                type="button"
                onClick={() => handleCurrencyChange('AED')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  currency === 'AED' ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:text-black'
                }`}
              >
                AED
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange('INR')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  currency === 'INR' ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:text-black'
                }`}
              >
                INR
              </button>
            </div>
          </div>

          {/* Monthly SIP Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-black">Monthly SIP Commitment</label>
              <span className="text-sm font-mono font-black text-white bg-black px-3 py-1 rounded">
                {formatCurrency(monthlySip, currency)}
              </span>
            </div>
            <input
              type="range"
              min={currency === 'AED' ? 500 : 10000}
              max={currency === 'AED' ? 50000 : 1000000}
              step={currency === 'AED' ? 500 : 5000}
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              className="w-full h-1 bg-black/10 rounded-full appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1 uppercase tracking-wider">
              <span>Min: {currency === 'AED' ? 'AED 500' : '₹10k'}</span>
              <span>Max: {currency === 'AED' ? 'AED 50k' : '₹1M'} / month</span>
            </div>
          </div>

          {/* Rate of Return Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1">
                Expected Annual Returns
                <TrendingUp className="w-3.5 h-3.5 text-black" />
              </label>
              <span className="text-sm font-bold font-mono text-black bg-[#EBEBE9] px-2 py-0.5 rounded">{rateOfReturn}%</span>
            </div>
            <input
              type="range"
              min={6}
              max={18}
              step={0.5}
              value={rateOfReturn}
              onChange={(e) => setRateOfReturn(Number(e.target.value))}
              className="w-full h-1 bg-black/10 rounded-full appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1 uppercase tracking-wider">
              <span>Conservative (6%)</span>
              <span>Balanced (11-13%)</span>
              <span>Aggressive (18%)</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-black">Wealth Accumulation Duration</label>
              <span className="text-sm font-bold text-black bg-[#EBEBE9] px-2 py-0.5 rounded">{years} Years</span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1 bg-black/10 rounded-full appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1 uppercase tracking-wider">
              <span>Short Term (3 Yrs)</span>
              <span>Intermediate (15 Yrs)</span>
              <span>Ultra (30 Yrs)</span>
            </div>
          </div>
        </div>

        {/* Results Panel - Right Grid */}
        <div className="md:col-span-5 bg-[#0A0A0A] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-3">Projected Corp Valuation</span>
            
            <div className="text-center py-6 bg-white/5 border border-white/5 rounded-2xl mb-6 relative overflow-hidden">
              <span className="text-[9px] text-white/40 block uppercase tracking-widest font-black">Total Accumulation</span>
              <span className="text-3xl font-light tracking-tighter text-white block my-1">
                {formatCurrency(totalWealth, currency)}
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                Equiv: {formatCurrency(currency === 'AED' ? totalWealth * EXCHANGE_RATE : totalWealth / EXCHANGE_RATE, currency === 'AED' ? 'INR' : 'AED')}
              </span>
            </div>

            {/* Micro details with custom SVG Donut Chart */}
            <div className="flex items-center gap-4">
              {/* Custom SVG Donut Arc */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-white/5"
                    strokeWidth="11"
                    fill="transparent"
                  />
                  {/* Total Invested Arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-white/20"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={circ}
                    strokeDashoffset={0}
                  />
                  {/* Gained Value Arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-white"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={circ}
                    strokeDashoffset={investDash}
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] font-bold text-white leading-none">{years}Y</span>
                </div>
              </div>

              {/* Legend stats */}
              <div className="flex-1 space-y-3 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-white/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 block"></span>
                    Invested
                  </div>
                  <span className="font-mono text-xs font-bold text-white block">
                    {formatCurrency(totalInvested, currency)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-white block"></span>
                    Est. Gains
                  </div>
                  <span className="font-mono text-xs font-bold text-white block">
                    +{formatCurrency(estWealthGained, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3.5 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
          >
            <Landmark className="w-4 h-4" />
            Attach Proposal to Booking
          </button>
        </div>
      </div>
    </div>
  );
}

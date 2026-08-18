import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { StickerTag } from '../common/StickerTag';
import { FoldedPaperCard } from '../common/FoldedPaperCard';
import { DecryptedText } from '../common/DecryptedText';
import { sound } from '../../utils/soundEngine';

export const WhyUsStats: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const vehicleType = '4x4';

  // Dynamic calculation of responders in radius and bounty rate in INR
  const respondersInRadius = Math.round(distanceKm * 1.8 + (vehicleType === '4x4' ? 12 : 5));
  const estimatedDispatchMin = Math.max(4.2, Math.round((distanceKm * 0.35 + 3) * 10) / 10);
  const estimatedEscrowBountyInr = Math.round(850 + distanceKm * 45 + (vehicleType === '4x4' ? 600 : 250));

  const statsCards = [
    {
      id: 'stat-1',
      metric: '₹18,500+',
      title: 'Avg Saved vs Private Tow / Crane Extortion',
      description: 'Zero predatory highway surge pricing. Decentralized escrow smart contracts lock transparent flat community rates.',
      pinColor: 'lime' as const,
      foldTheme: 'lime' as const,
      rotate: -1.5,
    },
    {
      id: 'stat-2',
      metric: '4.2 min',
      title: 'Avg Remote Dispatch Time',
      description: 'Passing peer vehicles catch local BLE hops and alert nearby Thar/Gurkha responders within a 45-km perimeter.',
      pinColor: 'magenta' as const,
      foldTheme: 'purple' as const,
      rotate: 1.8,
    },
    {
      id: 'stat-3',
      metric: '100%',
      title: 'Zero-Data Cellular Coverage',
      description: 'IN865 (865-867MHz) Sub-GHz LoRa + BLE 5.3 multi-hop routing operates with 0 bars Jio/Airtel reception.',
      pinColor: 'orange' as const,
      foldTheme: 'orange' as const,
      rotate: -1.2,
    },
    {
      id: 'stat-4',
      metric: '14,200+',
      title: 'Verified 4x4 Responders Fleet',
      description: 'Equipped with heavy winches, 2000A cold-crank jump packs, high-flow air compressors, and satellite beacons.',
      pinColor: 'blue' as const,
      foldTheme: 'cyan' as const,
      rotate: 1.5,
    },
  ];

  return (
    <section id="why-us" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Grid Layout matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: why us? sticker + narrative + calculator */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Neon Sticker Tag matching reference */}
          <StickerTag
            text="why us?"
            subtitle="decentralized / trustless"
            variant="lime"
            rotate={-3}
            size="xl"
            hasPin={true}
            pinColor="magenta"
            hasDogEar={true}
            className="mb-8"
          />

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Recognize safety, <br />
            <span className="text-slate-400 font-medium">— survive & thrive in remote terrain.</span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Traditional roadside assistance (RSA) and toll helpline services rely completely on working cellular towers.
            Once you ascend high Himalayan passes (Khardung La, Rohtang, Zojila) or enter Thar desert trails, traditional apps stop responding.
          </p>

          <p className="mt-3 text-slate-400 text-xs sm:text-sm">
            ResQGrid turns every passing truck, local taxi, and expedition 4x4 into an offline life-saving mesh repeater node.
          </p>

          {/* Interactive Fleet Dispatch Scrubber Box */}
          <div className="mt-8 w-full p-5 rounded-2xl bg-[#031519] border border-white/15 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#b6f014] flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                COMMUNITY RADIUS CALCULATOR
              </span>
              <span className="text-[10px] font-mono text-cyan-400">REAL-TIME SIM</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Distance From Nearest Highway:</span>
                  <span className="text-[#b6f014] font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  value={distanceKm}
                  onChange={(e) => {
                    setDistanceKm(Number(e.target.value));
                    sound.playClick(400 + Number(e.target.value) * 5);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#b6f014]"
                />
              </div>

              {/* Scrubber Computed Metrics in Rupees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono">
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Nearby Peered Fleet</span>
                  <span className="text-sm sm:text-base font-bold text-cyan-300">
                    {respondersInRadius} Rigs
                  </span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Est. Response</span>
                  <span className="text-sm sm:text-base font-bold text-[#b6f014]">
                    {estimatedDispatchMin}m
                  </span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Fair Escrow</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400">
                    ₹{estimatedEscrowBountyInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stacked Folded Paper Metric Cards */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {statsCards.map((stat, idx) => (
            <FoldedPaperCard
              key={stat.id}
              cardBg="bg-white"
              textColor="text-slate-900"
              foldSize="md"
              foldTheme={stat.foldTheme}
              pinColor={stat.pinColor}
              pinPosition={idx % 2 === 0 ? 'top-left' : 'top-right'}
              rotate={stat.rotate}
              className="w-full max-w-xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                      <DecryptedText text={stat.metric} speed={40} maxIterations={12} />
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-[#b6f014]">
                      VERIFIED
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mt-1">
                    {stat.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </FoldedPaperCard>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, X } from 'lucide-react';
import { StickerTag } from '../common/StickerTag';
import { PushPin } from '../common/PushPin';
import { realWorldRescues } from '../../utils/mockData';
import type { RescueCase } from '../../utils/mockData';
import { sound } from '../../utils/soundEngine';

export const OurWorkShowcase: React.FC = () => {
  const [selectedRescue, setSelectedRescue] = useState<RescueCase | null>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedRescue) {
        setSelectedRescue(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRescue]);

  const handleOpenRescue = (rescue: RescueCase) => {
    setSelectedRescue(rescue);
    sound.playPaperCard();
  };

  const getPinColor = (idx: number): 'magenta' | 'orange' | 'cyan' | 'blue' => {
    const colors: ('magenta' | 'orange' | 'cyan' | 'blue')[] = ['magenta', 'orange', 'cyan', 'blue'];
    return colors[idx % colors.length];
  };

  const getFlapGradient = (tagColor: string) => {
    switch (tagColor) {
      case 'lime':
        return 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)';
      case 'cyan':
        return 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)';
      default:
        return 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)';
    }
  };

  return (
    <section id="our-work" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      {/* Neon Lime Sticker Tag matching Reference */}
      <div className="flex flex-col items-center">
        <StickerTag
          text="our work"
          subtitle="verified telemetry"
          variant="lime"
          rotate={-2}
          size="xl"
          hasPin={true}
          pinColor="magenta"
          pinPos="top-right"
          hasDogEar={true}
          className="mb-4"
        />

        <p className="font-heading text-lg sm:text-2xl text-slate-200 font-semibold max-w-xl">
          — Real remote rescues across India, <br />
          <span className="text-slate-400 font-normal">
            verified through cryptographic zero-knowledge telemetry.
          </span>
        </p>
      </div>

      {/* 3-Card Polaroid Grid matching Reference Layout */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 items-center">
        {realWorldRescues.slice(0, 3).map((rescue, index) => {
          const pinColor = getPinColor(index);
          const rotations = [-2.5, 1.2, -1.8];
          const rot = rotations[index % rotations.length];

          return (
            <motion.div
              key={rescue.id}
              onClick={() => handleOpenRescue(rescue)}
              whileHover={{
                scale: 1.04,
                rotate: rot + (rot >= 0 ? 2 : -2),
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
              whileTap={{ scale: 0.96 }}
              style={{ transform: `rotate(${rot}deg)` }}
              className="relative cursor-pointer select-none group max-w-sm mx-auto w-full"
            >
              {/* PushPin on Top */}
              <div
                className={`absolute z-30 ${
                  index === 0
                    ? '-top-3 left-4'
                    : index === 1
                    ? '-top-3 right-4'
                    : '-top-3 left-1/2 -translate-x-1/2'
                }`}
              >
                <PushPin color={pinColor} size="lg" />
              </div>

              {/* Main Polaroid Body with Dog-Ear Corner */}
              <div
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)',
                }}
                className="bg-white p-4 pb-8 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.15)] border border-slate-200 text-left transition-shadow group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
              >
                {/* Photo Frame */}
                <div className="relative h-48 sm:h-52 w-full rounded-md overflow-hidden bg-slate-900 mb-3 border border-slate-100">
                  <img
                    src={rescue.imageUrl}
                    alt={rescue.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#b6f014] font-bold border border-white/10">
                    {rescue.hopsRequired} MESH HOPS
                  </div>
                </div>

                {/* Card Title & Vehicle Info in Rupees */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold">
                    <span>{rescue.date}</span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {rescue.responderRating}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-slate-950 text-base sm:text-lg line-clamp-1">
                    {rescue.title}
                  </h3>

                  <p className="font-sans text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {rescue.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-100 mt-2">
                    <span className="text-slate-500">{rescue.dispatchTimeMin}m Arrival</span>
                    <span className="text-emerald-700 font-bold">₹{rescue.escrowBountyInr.toLocaleString('en-IN')} Bounty</span>
                  </div>
                </div>
              </div>

              {/* Dog-Ear Bottom-Right Fold Flap */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  background: getFlapGradient(rescue.tagColor),
                  clipPath: 'polygon(0 0, 0 100%, 100% 0)',
                  transform: 'rotate(180deg)',
                  boxShadow: '-3px -3px 6px rgba(0,0,0,0.3)',
                }}
                className="absolute bottom-0 right-0 pointer-events-none z-20"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Detail Modal for Selected Rescue */}
      <AnimatePresence>
        {selectedRescue && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                sound.playClick(500);
                setSelectedRescue(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden text-left border-4 border-[#b6f014]"
            >
              {/* Sticky Modal Header */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-[#b6f014] text-xs font-mono font-bold uppercase">
                    OFF-GRID RESCUE LOG
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    REF: {selectedRescue.id}
                  </span>
                </div>

                <button
                  onClick={() => {
                    sound.playClick(500);
                    setSelectedRescue(null);
                  }}
                  aria-label="Close rescue log"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-800 transition-colors font-mono text-xs cursor-pointer"
                >
                  <span>Close</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950">
                  {selectedRescue.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {selectedRescue.location} ({selectedRescue.coordinates})
                </p>

                <div className="my-4 h-48 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                  <img
                    src={selectedRescue.imageUrl}
                    alt={selectedRescue.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-slate-950 font-heading block">Stranded Vehicle & Condition:</strong>
                    <p className="text-slate-700">{selectedRescue.vehicle} — {selectedRescue.issue}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">VERIFIED RESPONDER:</span>
                      <strong className="text-slate-900 text-sm">{selectedRescue.responderName}</strong>
                      <p className="text-slate-600">{selectedRescue.responderVehicle}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SETTLEMENT ESCROW:</span>
                      <strong className="text-emerald-700 text-sm">₹{selectedRescue.escrowBountyInr.toLocaleString('en-IN')} Released</strong>
                      <p className="text-slate-600">{selectedRescue.dispatchTimeMin} mins response</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="shrink-0 flex justify-end p-4 sm:p-6 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRescue(null)}
                  className="px-6 py-2.5 bg-slate-950 text-white rounded-xl font-heading font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

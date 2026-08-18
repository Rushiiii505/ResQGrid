import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, Activity, Terminal } from 'lucide-react';
import { StickerTag } from '../common/StickerTag';
import { DecryptedText } from '../common/DecryptedText';
import { MeshRelayVisualizer } from './MeshRelayVisualizer';
import { sound } from '../../utils/soundEngine';

interface HeroSectionProps {
  onOpenSOSModal: () => void;
  onOpenVisionModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSOSModal,
  onOpenVisionModal,
}) => {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Top Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-[#b6f014] animate-pulse" />
        <span className="text-xs font-mono font-medium text-slate-300">
          Decentralized Off-Grid Telemetry Network (IN865 Mesh)
        </span>
        <span className="text-[10px] font-mono text-[#b6f014] bg-[#b6f014]/10 px-1.5 py-0.5 rounded border border-[#b6f014]/20">
          IN865 ISM
        </span>
      </motion.div>

      {/* Main Reference-Style Expressive Typography */}
      <div className="relative flex flex-col items-center justify-center font-heading font-black tracking-tight leading-[1.05] text-white select-none max-w-4xl">
        {/* Decorative Lightning Bolt Left */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute -left-4 sm:-left-12 top-6 text-[#00f0ff] opacity-80 pointer-events-none hidden md:block"
        >
          <Zap className="w-8 h-8 fill-[#00f0ff]" />
        </motion.div>

        {/* Decorative Lightning Bolt Right */}
        <motion.div
          animate={{ rotate: [5, -5, 5], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.7, ease: 'easeInOut', delay: 0.3 }}
          className="absolute -right-4 sm:-right-12 top-10 text-[#b6f014] opacity-90 pointer-events-none hidden md:block"
        >
          <Zap className="w-10 h-10 fill-[#b6f014]" />
        </motion.div>

        {/* Top line: /zero signal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter lowercase flex items-center justify-center gap-2"
        >
          <span className="text-white">/zero</span>
          <span className="text-slate-300">signal</span>
        </motion.div>

        {/* Second line: rescue with its - */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl text-slate-100 font-extrabold tracking-tight lowercase mt-1"
        >
          rescue with its –
        </motion.div>

        {/* Third line: [ super. ] [ mesh. ] sticker badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3"
        >
          {/* Super Cyan Sticker */}
          <div className="bg-[#00f0ff] text-[#041c22] px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-2xl sm:text-4xl md:text-5xl font-black lowercase shadow-[0_8px_20px_rgba(0,240,255,0.3)] border-2 border-[#38bdf8] -rotate-2">
            super.
          </div>

          {/* Mesh Neon Lime Sticker with dog-ear corner */}
          <StickerTag
            text="mesh."
            subtitle="p2p dispatch"
            variant="lime"
            rotate={2}
            size="lg"
            hasPin={true}
            pinColor="magenta"
            pinPos="top-right"
            hasDogEar={true}
          />
        </motion.div>
      </div>

      {/* Subtitle with Decrypted Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-sans font-medium"
      >
        When Airtel and Jio signals vanish in Ladakh passes, Spiti gorges, Thar dunes, or Western Ghats, ResQGrid
        relays encrypted distress telemetry across passing 4x4 vehicles to dispatch local community rescue.
      </motion.p>

      {/* Hero Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8"
      >
        <button
          onClick={() => {
            sound.playSosAlarm();
            onOpenSOSModal();
          }}
          className="group relative flex items-center gap-3 px-7 py-4 bg-[#b6f014] text-[#041c22] font-heading font-black text-base sm:text-lg rounded-2xl shadow-[0_12px_28px_rgba(182,240,20,0.35)] hover:shadow-[0_16px_36px_rgba(182,240,20,0.5)] border-2 border-[#d4ff00] hover:scale-105 transition-all cursor-pointer"
        >
          <Terminal className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Launch Emergency Simulator</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={() => {
            sound.playClick(880);
            onOpenVisionModal();
          }}
          className="flex items-center gap-2.5 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-heading font-bold text-base sm:text-lg rounded-2xl border border-white/15 backdrop-blur-md transition-all hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>On-Device Vision Scanner</span>
        </button>
      </motion.div>

      {/* Real-time Decrypted Matrix Beacon Status (Indian GPS Coordinates) */}
      <div className="mt-8 flex items-center gap-3 text-xs font-mono text-slate-400 bg-[#021013] px-4 py-2 rounded-full border border-white/10 shadow-inner">
        <Activity className="w-3.5 h-3.5 text-[#b6f014] animate-spin" />
        <span>LAST MESH BEACON:</span>
        <DecryptedText
          text="LAT 34.2787 N, LON 77.6047 E (KHARDUNG LA, LADAKH - 3 HOPS SECURED)"
          speed={30}
          maxIterations={12}
          className="text-cyan-300 font-bold"
        />
      </div>

      {/* Interactive Mesh Hop Telemetry Component */}
      <div className="w-full mt-12">
        <MeshRelayVisualizer />
      </div>
    </section>
  );
};

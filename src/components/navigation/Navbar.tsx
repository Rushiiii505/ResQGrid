import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Volume2, VolumeX, Sparkles, Zap, Menu, X } from 'lucide-react';
import { sound } from '../../utils/soundEngine';

interface NavbarProps {
  onOpenSOSModal: () => void;
  onOpenVisionModal: () => void;
  activeNodesCount?: number;
  viewMode: 'driver' | 'responder';
  onToggleViewMode: (mode: 'driver' | 'responder') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSOSModal,
  onOpenVisionModal,
  activeNodesCount = 4,
  viewMode,
  onToggleViewMode,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'Why Us', href: '#why-us' },
    { label: 'Services', href: '#services' },
    { label: 'Simulator', href: '#simulator' },
    { label: 'Rescues', href: '#our-work' },
  ];

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pointer-events-auto w-full max-w-6xl backdrop-blur-2xl bg-[#041c22]/95 border border-white/15 rounded-full px-3.5 sm:px-5 py-2 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-2 sm:gap-4"
      >
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#"
            onClick={() => sound.playClick(900)}
            className="flex items-center gap-2 group select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#b6f014] flex items-center justify-center text-[#041c22] font-black text-sm shadow-[0_0_14px_rgba(182,240,20,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6 shrink-0">
              <Radio className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-heading font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 shrink-0">
              ResQGrid
              <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 bg-[#b6f014]/20 text-[#b6f014] rounded font-bold border border-[#b6f014]/30">
                IN865
              </span>
            </span>
          </a>

          {/* Compact Mesh Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-black/40 border border-white/10 rounded-full text-[10px] font-mono text-slate-300 whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b6f014] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b6f014]" />
            </span>
            <span>{activeNodesCount} Nodes Live</span>
          </div>
        </div>

        {/* Center: Mode Switcher & Navigation Links */}
        <div className="flex items-center gap-2">
          {/* Dual-Mode Switcher */}
          <div className="flex items-center bg-black/50 p-1 rounded-full border border-white/10 shrink-0">
            <button
              onClick={() => {
                sound.playClick(800);
                onToggleViewMode('driver');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                viewMode === 'driver'
                  ? 'bg-[#b6f014] text-[#041c22] font-black shadow-[0_0_10px_rgba(182,240,20,0.35)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Driver SOS
            </button>
            <button
              onClick={() => {
                sound.playRadioSquelch();
                onToggleViewMode('responder');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                viewMode === 'responder'
                  ? 'bg-cyan-400 text-[#041c22] font-black shadow-[0_0_10px_rgba(0,240,255,0.35)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Responder Radar
            </button>
          </div>

          {/* Nav Links (Visible on Large Screens) */}
          {viewMode === 'driver' && (
            <div className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-xs font-heading font-medium text-slate-300">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => sound.playClick(720)}
                  className="px-2.5 py-1 rounded-full transition-all hover:text-[#b6f014] hover:bg-white/10 text-[11px]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions: Audio Button + Vision AI + Trigger Mesh SOS */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Clean, Non-Overlapping Audio Toggle Button */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
            title={isMuted ? 'Audio Muted (Click to Unmute)' : 'Audio Active (Click to Mute)'}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer select-none shrink-0 ${
              isMuted
                ? 'bg-white/5 border-white/15 text-slate-400 hover:bg-white/10 hover:text-white'
                : 'bg-emerald-950/70 border-emerald-500/50 text-[#b6f014] shadow-[0_0_10px_rgba(182,240,20,0.3)] hover:bg-emerald-900/70'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#b6f014]" />
            )}
          </button>

          {/* Vision AI Trigger Button */}
          <button
            onClick={() => {
              sound.playClick(840);
              onOpenVisionModal();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vision AI</span>
          </button>

          {/* Trigger Mesh SOS Neon Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sound.playSosAlarm();
              onOpenSOSModal();
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#b6f014] text-[#041c22] font-heading font-black text-xs sm:text-sm rounded-full shadow-[0_0_18px_rgba(182,240,20,0.45)] border border-[#d4ff00] hover:bg-[#d4ff00] transition-all shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 fill-[#041c22]" />
            <span>Trigger SOS</span>
          </motion.button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-full bg-white/5 border border-white/10 text-white cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="pointer-events-auto w-full max-w-sm mt-2 p-4 bg-[#031519]/95 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col gap-2 xl:hidden"
          >
            <div className="pb-2 mb-2 border-b border-white/10 text-center">
              <span className="text-[11px] font-mono text-[#b6f014]">
                IN865 MESH: ACTIVE ({activeNodesCount} Rigs Nearby)
              </span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playClick(720);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl text-sm font-heading font-bold text-slate-200 hover:bg-white/10 hover:text-[#b6f014] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                sound.playClick(840);
                setMobileMenuOpen(false);
                onOpenVisionModal();
              }}
              className="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Vision AI Scanner</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, Send, CheckCircle2 } from 'lucide-react';
import { StickerTag } from '../common/StickerTag';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';

interface FooterCTAProps {
  onOpenSOSModal: () => void;
}

export const FooterCTA: React.FC<FooterCTAProps> = ({ onOpenSOSModal }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    sound.playSuccessChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#b6f014', '#00f0ff', '#ffffff'],
    });
  };

  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      {/* Reference Image Style Expressive Bottom Headline */}
      <div className="flex flex-col items-center justify-center font-heading font-black tracking-tight select-none">
        <span className="text-3xl sm:text-5xl md:text-6xl text-white font-extrabold lowercase">
          let's rescue
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          <span className="text-3xl sm:text-5xl md:text-6xl text-slate-200 lowercase font-extrabold">
            /together
          </span>

          {/* Cyan Badge */}
          <div className="bg-[#00f0ff] text-[#041c22] px-4 py-1 sm:px-5 sm:py-2 rounded-lg text-2xl sm:text-4xl md:text-5xl font-black lowercase shadow-[0_8px_20px_rgba(0,240,255,0.3)] border-2 border-[#38bdf8] -rotate-2">
            stay.
          </div>

          {/* Neon Lime Sticker Tag */}
          <StickerTag
            text="connected"
            subtitle="zero dead zones"
            variant="lime"
            rotate={3}
            size="lg"
            hasPin={true}
            pinColor="magenta"
            pinPos="top-right"
            hasDogEar={true}
          />
        </div>
      </div>

      <p className="mt-6 text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-sans">
        Turn your daily commute or weekend overland trip into a life-saving decentralized node.
        Install the ResQGrid background daemon and earn automatic mesh relay bounties.
      </p>

      {/* Interactive Node Join Newsletter Box */}
      <div className="mt-8 max-w-md mx-auto">
        {isSubscribed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-white/10 border border-[#b6f014] text-white flex items-center justify-center gap-2 font-mono text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-[#b6f014]" />
            <span>Beacon Node registered! Key dispatched to your inbox.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter overlander / responder email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#021013] border border-white/20 rounded-xl text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-[#b6f014] shadow-inner"
              required
            />
            <button
              type="submit"
              onClick={() => sound.playClick(800)}
              className="px-5 py-3 bg-[#b6f014] hover:bg-[#d4ff00] text-[#041c22] font-heading font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>Join Mesh</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Quick Launch SOS Button */}
      <div className="mt-10">
        <button
          onClick={() => {
            sound.playSosAlarm();
            onOpenSOSModal();
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#b6f014] font-mono text-xs border border-white/15 backdrop-blur-md transition-all hover:border-[#b6f014]/50"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Launch Emergency Simulator Playground</span>
        </button>
      </div>

      {/* Bottom Copyright & Status Bar */}
      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#b6f014] flex items-center justify-center text-[#041c22] font-black text-xs">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-bold text-slate-300">ResQGrid (Antigravity)</span>
          <span>© 2026. Decentralized Emergency Mesh.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#why-us" className="hover:text-[#b6f014] transition-colors">/why us</a>
          <a href="#services" className="hover:text-[#b6f014] transition-colors">/services</a>
          <a href="#our-work" className="hover:text-[#b6f014] transition-colors">/our work</a>
          <span className="text-cyan-400">RFC-8920 MESH SPEC</span>
        </div>
      </div>
    </footer>
  );
};

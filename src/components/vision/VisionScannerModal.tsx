import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Camera, ArrowRight } from 'lucide-react';
import { obdDatabase } from '../../utils/mockData';
import type { OBDDiagnosticItem } from '../../utils/mockData';
import { sound } from '../../utils/soundEngine';

interface VisionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchAssistance?: () => void;
}

const sampleTargets = [
  {
    id: 'P0300',
    name: 'Dashboard Warning (Flashing Check Engine)',
    category: 'Instrument Cluster',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P0217',
    name: 'Radiator Hose & Coolant Steam',
    category: 'Under-Bonnet Cooling',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P0627',
    name: 'Engine Bay Fuse Block Box',
    category: 'Electrical Relay / Fuse',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P0562',
    name: '12V Exide/Amaron Battery Terminals',
    category: 'Charging System',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  },
];

export const VisionScannerModal: React.FC<VisionScannerModalProps> = ({
  isOpen,
  onClose,
  onDispatchAssistance,
}) => {
  const [selectedTarget, setSelectedTarget] = useState(sampleTargets[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OBDDiagnosticItem | null>(obdDatabase[sampleTargets[0].id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleScan = () => {
    setIsScanning(true);
    sound.playRadarPing();

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(obdDatabase[selectedTarget.id] || null);
      sound.playSuccessChime();
    }, 1400);
  };

  const handleSelectSample = (target: typeof sampleTargets[0]) => {
    setSelectedTarget(target);
    setScanResult(null);
    sound.playClick(720);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop with Click to Close */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            sound.playClick(500);
            onClose();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#021013] border-2 border-cyan-500/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,240,255,0.18)] overflow-hidden"
        >
          {/* Header with Clear In-View Close Button */}
          <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#041c22] border-b border-white/15 z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center border border-[#00f0ff]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-white block">
                  ON-DEVICE VISION AI DIAGNOSTICS
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  100% OFFLINE INFERENCE (ZERO DATA REQUIRED)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick(500);
                onClose();
              }}
              aria-label="Close vision scanner"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/20 hover:border-rose-400/50 transition-all font-mono text-xs cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-[#00f0ff]" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Target Selector */}
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase block mb-2">
                Select Camera Feed Target:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleTargets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleSelectSample(target)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedTarget.id === target.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                      {target.category}
                    </span>
                    <span className="text-xs font-heading font-bold line-clamp-1 mt-0.5">
                      {target.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated AR Camera Viewport */}
            <div className="relative h-60 sm:h-72 rounded-2xl bg-black overflow-hidden border border-cyan-500/40">
              <img
                src={selectedTarget.image}
                alt={selectedTarget.name}
                className="w-full h-full object-cover opacity-75"
              />

              {/* AR HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start font-mono text-[10px] text-cyan-400">
                  <span className="bg-black/70 px-2 py-1 rounded border border-cyan-500/30">
                    CAM: 60 FPS [1080P]
                  </span>
                  <span className="bg-black/70 px-2 py-1 rounded border border-cyan-500/30">
                    MODEL: ONNX-QUANT-8BIT
                  </span>
                </div>

                {/* Central Targeting Reticle */}
                <div className="relative w-32 h-32 mx-auto my-auto border-2 border-dashed border-[#b6f014] rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#b6f014] animate-ping" />
                  {isScanning && (
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]"
                    />
                  )}
                </div>

                <div className="flex justify-between items-end font-mono text-[10px] text-slate-300">
                  <span className="bg-black/70 px-2 py-1 rounded">
                    FOV: 78° | SENSOR: SONY IMX
                  </span>
                  <span className="text-[#b6f014] bg-black/70 px-2 py-1 rounded">
                    {isScanning ? 'ANALYZING TENSORS...' : 'READY TO DIAGNOSE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scan Action */}
            <div className="flex justify-center">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-[#00f0ff] hover:bg-[#38bdf8] text-[#041c22] font-heading font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-105 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{isScanning ? 'Scanning Neural Network...' : 'Analyze Fault with Vision AI'}</span>
              </button>
            </div>

            {/* Scan Diagnostic Result Card in Rupees */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white text-slate-900 shadow-2xl border-2 border-[#b6f014]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded bg-slate-950 text-[#b6f014]">
                      CODE: {scanResult.code}
                    </span>
                    <span className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                      {scanResult.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    SEVERITY: {scanResult.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
                  <div>
                    <span className="font-mono text-slate-500 font-bold block mb-1">
                      IMMEDIATE ACTION:
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {scanResult.immediateAction}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-slate-500 font-bold block mb-1">
                      ESTIMATED REPAIR / PARTS:
                    </span>
                    <p className="text-slate-800 font-bold">
                      {scanResult.partNeeded} ({scanResult.estCost})
                    </p>
                    <p className="text-emerald-700 font-mono text-[11px] mt-1 font-bold">
                      Safe to drive: ~{scanResult.safeToDriveKm} km
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      sound.playSosAlarm();
                      onClose();
                      onDispatchAssistance?.();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-[#b6f014] rounded-xl font-heading font-bold text-xs transition-all cursor-pointer"
                  >
                    <span>Request Part via Mesh Bounty 🔧</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

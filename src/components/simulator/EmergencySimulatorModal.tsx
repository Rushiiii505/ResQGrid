import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plane,
  Radio,
  RotateCcw,
  Lock,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { breakdownScenarios } from '../../utils/mockData';
import type { BreakdownScenario } from '../../utils/mockData';
import { sound } from '../../utils/soundEngine';

interface EmergencySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SimStage = 'idle' | 'encrypting' | 'hopping' | 'escrow_locked' | 'dispatched' | 'rescued';

export const EmergencySimulatorModal: React.FC<EmergencySimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [airplaneMode, setAirplaneMode] = useState<boolean>(true);
  const [selectedScenario, setSelectedScenario] = useState<BreakdownScenario>(breakdownScenarios[0]);
  const [stage, setStage] = useState<SimStage>('idle');
  const [currentHop, setCurrentHop] = useState<number>(0);
  const [bountyAmountInr, setBountyAmountInr] = useState<number>(selectedScenario.suggestedBountyInr);
  const [etaSeconds, setEtaSeconds] = useState<number>(14);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Update bounty when scenario changes
  useEffect(() => {
    setBountyAmountInr(selectedScenario.suggestedBountyInr);
    setStage('idle');
    setCurrentHop(0);
  }, [selectedScenario]);

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

  // Run simulation workflow
  const handleStartSimulation = () => {
    sound.playSosAlarm();
    setStage('encrypting');
    setCurrentHop(0);

    // Step 1: Encrypting packet (800ms)
    setTimeout(() => {
      setStage('hopping');
      sound.playMeshHop(1);
      setCurrentHop(1);

      // Hop 2 (1600ms)
      setTimeout(() => {
        sound.playMeshHop(2);
        setCurrentHop(2);

        // Hop 3 (2400ms)
        setTimeout(() => {
          sound.playMeshHop(3);
          setCurrentHop(3);
          setStage('escrow_locked');
          sound.playClick(920);

          // Dispatched (3400ms)
          setTimeout(() => {
            setStage('dispatched');
            sound.playSuccessChime();

            // Countdown to Rescue (starts at 6s)
            let countdown = 6;
            const timer = setInterval(() => {
              countdown -= 1;
              setEtaSeconds(countdown);
              if (countdown <= 0) {
                clearInterval(timer);
                setStage('rescued');
                sound.playSuccessChime();

                // Trigger celebration confetti
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#b6f014', '#00f0ff', '#ffffff', '#9855ff'],
                });
              }
            }, 1000);
          }, 1200);
        }, 1000);
      }, 1000);
    }, 900);
  };

  const handleReset = () => {
    setStage('idle');
    setCurrentHop(0);
    setEtaSeconds(14);
    sound.playClick(600);
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
          ref={modalContentRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#021013] border-2 border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(182,240,20,0.18)] overflow-hidden"
        >
          {/* Top Bar with Prominent, Always-Visible Close Button */}
          <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#041c22] border-b border-white/15 z-20">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
              </div>
              <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#b6f014]" />
                INDIA_EMERGENCY_MESH_SIMULATOR://v2.4
              </span>
            </div>

            {/* Clearly Styled Close Button */}
            <button
              onClick={() => {
                sound.playClick(500);
                onClose();
              }}
              aria-label="Close emergency simulator"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/20 hover:border-rose-400/50 transition-all font-mono text-xs cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-[#b6f014]" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Control Strip: Airplane Mode & Indian Hardware Connectivity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10">
              {/* Airplane Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      airplaneMode ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold block text-white">Airplane Mode</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {airplaneMode ? '0 BARS (OFFLINE)' : 'JIO/AIRTEL CONNECTED'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAirplaneMode(!airplaneMode);
                    sound.playClick(700);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    airplaneMode ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      airplaneMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Protocol status */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">INDIAN ISM BAND</span>
                  <span className="text-cyan-300 font-bold">IN865 (865MHz) + BLE 5.3</span>
                </div>
              </div>

              {/* Escrow Status in Rupees */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SMART ESCROW</span>
                  <span className="text-[#b6f014] font-bold">₹{bountyAmountInr.toLocaleString('en-IN')} INR LOCKED</span>
                </div>
              </div>
            </div>

            {/* Step 1: Pick Breakdown Scenario */}
            <div>
              <label className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-3">
                1. Select Simulated Indian Terrain Breakdown:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {breakdownScenarios.map((scen) => {
                  const isSelected = selectedScenario.id === scen.id;
                  return (
                    <div
                      key={scen.id}
                      onClick={() => {
                        setSelectedScenario(scen);
                        sound.playClick(680);
                      }}
                      className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-[#b6f014] shadow-[0_0_15px_rgba(182,240,20,0.2)]'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-heading font-bold text-white line-clamp-1">
                          {scen.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            scen.severity === 'Critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {scen.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {scen.description}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/5">
                        <span className="text-slate-500">Bounty: ₹{scen.suggestedBountyInr.toLocaleString('en-IN')}</span>
                        <span className="text-[#b6f014] font-bold">{scen.estimatedHops} Hops</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Live Multi-Hop Telemetry Terminal Visualizer */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  TELEMETRY PIPELINE & HOP MONITOR (HIMALAYAN MESH)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  STATUS: <strong className="text-[#b6f014] uppercase">{stage}</strong>
                </span>
              </div>

              {/* Progress Step Indicators */}
              <div className="grid grid-cols-5 gap-2 my-4">
                {[
                  { label: '1. Encrypt', active: stage !== 'idle' },
                  { label: '2. Mesh Hop', active: stage === 'hopping' || stage === 'escrow_locked' || stage === 'dispatched' || stage === 'rescued' },
                  { label: '3. Escrow', active: stage === 'escrow_locked' || stage === 'dispatched' || stage === 'rescued' },
                  { label: '4. Dispatch', active: stage === 'dispatched' || stage === 'rescued' },
                  { label: '5. Rescued', active: stage === 'rescued' },
                ].map((st, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg text-center font-mono text-[10px] transition-all ${
                      st.active
                        ? 'bg-[#b6f014] text-[#041c22] font-bold shadow-[0_0_10px_rgba(182,240,20,0.3)]'
                        : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>

              {/* Terminal Logs Window */}
              <div className="p-3 bg-[#010a0c] rounded-xl font-mono text-[11px] space-y-1.5 border border-white/10 text-slate-300 min-h-[110px]">
                {stage === 'idle' && (
                  <p className="text-slate-500">
                    &gt; Radio idle. Click "Send Distress Beacon" below to simulate offline packet routing across passing Indian vehicles.
                  </p>
                )}
                {stage === 'encrypting' && (
                  <p className="text-cyan-400 animate-pulse">
                    &gt; [AES-256-GCM] Packetizing distress payload: {selectedScenario.title} ... 0 bars Jio/Airtel detected.
                  </p>
                )}
                {stage === 'hopping' && (
                  <>
                    <p className="text-yellow-400">
                      &gt; [BLE 5.3 BROADCAST] Hop {currentHop}/3 caught by passing Mahindra Thar 4x4 (RSSI: -58 dBm).
                    </p>
                    <p className="text-slate-400">
                      &gt; Relay forwarded to Khardung La LoRa Repeater #08 (865MHz, 22.4 km range).
                    </p>
                  </>
                )}
                {(stage === 'escrow_locked' || stage === 'dispatched' || stage === 'rescued') && (
                  <>
                    <p className="text-purple-300">
                      &gt; [ESCROW LOCKED] ₹{bountyAmountInr.toLocaleString('en-IN')} INR collateral verified via community multi-sig.
                    </p>
                    <p className="text-[#b6f014]">
                      &gt; [DISPATCH CONFIRMED] Unit 04 (Force Gurkha 4x4 - WARN Winch) en route. GPS ETA: {etaSeconds}s.
                    </p>
                  </>
                )}
                {stage === 'rescued' && (
                  <p className="text-emerald-400 font-bold">
                    &gt; [RESCUE ACCOMPLISHED] Vehicle recovered! Smart contract bounty of ₹{bountyAmountInr.toLocaleString('en-IN')} released to local responder.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-[#031418] border-t border-white/10 z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* High-Impact Send Distress Beacon Button */}
            <button
              onClick={handleStartSimulation}
              disabled={stage !== 'idle' && stage !== 'rescued'}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-heading font-black text-sm tracking-wide transition-all cursor-pointer ${
                stage !== 'idle' && stage !== 'rescued'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#b6f014] hover:bg-[#d4ff00] text-[#041c22] shadow-[0_0_25px_rgba(182,240,20,0.45)] hover:scale-105 border border-[#d4ff00]'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {stage === 'rescued'
                  ? 'Re-Run Emergency Simulation'
                  : 'Send Distress Beacon 🚨'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

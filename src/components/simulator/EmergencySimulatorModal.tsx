import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Radio,
  WifiOff,
  Lock,
  Zap,
  RotateCcw,
  Mic,
  Download,
  Square,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { breakdownScenarios } from '../../utils/mockData';
import type { BreakdownScenario } from '../../utils/mockData';
import { sound } from '../../utils/soundEngine';
import { encryptPayloadAES } from '../../utils/cryptoEngine';
import { getRealDeviceLocation, DEFAULT_FALLBACK_LOCATION } from '../../utils/geoEngine';
import type { GeoLocationState } from '../../utils/geoEngine';
import { meshBus } from '../../utils/realMeshBus';
import type { LiveDistressBeacon } from '../../utils/realMeshBus';

interface EmergencySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SimulationStage =
  | 'idle'
  | 'encrypting'
  | 'hopping'
  | 'escrow_locked'
  | 'dispatched'
  | 'rescued';

export const EmergencySimulatorModal: React.FC<EmergencySimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [airplaneMode, setAirplaneMode] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<BreakdownScenario>(breakdownScenarios[0]);
  const [bountyAmountInr, setBountyAmountInr] = useState(breakdownScenarios[0].suggestedBountyInr);
  const [stage, setStage] = useState<SimulationStage>('idle');
  const [currentHop, setCurrentHop] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(180);
  const [realGps, setRealGps] = useState<GeoLocationState>(DEFAULT_FALLBACK_LOCATION);

  // Real Crypto Hash State
  const [cryptoHash, setCryptoHash] = useState<string>('0xPending');
  const [encryptedPayload, setEncryptedPayload] = useState<string>('');

  // Real Microphone Voice Dispatch Recorder State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Query real GPS location
  useEffect(() => {
    if (isOpen) {
      getRealDeviceLocation().then((loc) => setRealGps(loc));
    }
  }, [isOpen]);

  useEffect(() => {
    setBountyAmountInr(selectedScenario.suggestedBountyInr);
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

  // Real Audio Voice Recording Functions
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecordingAudio(true);
      sound.playClick(900);
    } catch (err) {
      console.warn('Microphone access failed:', err);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      sound.playClick(600);
    }
  };

  // Launch Simulation and Real Mesh Broadcast
  const handleStartSimulation = async () => {
    sound.playMorseSOS();
    setStage('encrypting');

    // 1. Generate real AES-256-GCM encryption & SHA-256 telemetry hash
    const rawTelemetry = {
      scenario: selectedScenario.title,
      bountyInr: bountyAmountInr,
      gps: { lat: realGps.lat, lng: realGps.lng, alt: realGps.altitude },
      node: meshBus.localNodeId,
      timestamp: Date.now(),
    };

    const encResult = await encryptPayloadAES(JSON.stringify(rawTelemetry));
    setCryptoHash(encResult.hash);
    setEncryptedPayload(encResult.ciphertext);

    // 2. Broadcast Live Beacon on real cross-tab mesh bus
    const liveBeacon: LiveDistressBeacon = {
      id: 'beacon-' + Date.now().toString(36),
      senderNodeId: meshBus.localNodeId,
      senderName: 'You (Mahindra Thar 4x4)',
      vehicle: 'Mahindra Thar 4x4',
      category: selectedScenario.category,
      issueTitle: selectedScenario.title,
      severity: selectedScenario.severity,
      lat: realGps.lat,
      lng: realGps.lng,
      altitude: realGps.altitude,
      bountyInr: bountyAmountInr,
      timestamp: Date.now(),
      encryptedHash: encResult.hash.slice(0, 16) + '...',
      status: 'BROADCASTING',
      hops: selectedScenario.estimatedHops,
    };

    meshBus.broadcastSOS(liveBeacon);

    // 3. Step Through Multi-Hop Relay
    setTimeout(() => {
      setStage('hopping');
      setCurrentHop(1);
      sound.playMeshHop(1);
    }, 1200);

    setTimeout(() => {
      setCurrentHop(2);
      sound.playMeshHop(2);
    }, 2400);

    setTimeout(() => {
      setCurrentHop(3);
      sound.playMeshHop(3);
      setStage('escrow_locked');
      sound.playRadioSquelch();
    }, 3600);

    setTimeout(() => {
      setStage('dispatched');
      setEtaSeconds(45);
      sound.playClick(1000);
    }, 5000);

    setTimeout(() => {
      setStage('rescued');
      sound.playSuccessChime();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#b6f014', '#00f0ff', '#ffffff', '#a855f7'],
      });
    }, 7200);
  };

  const handleReset = () => {
    setStage('idle');
    setCurrentHop(0);
    setEtaSeconds(180);
    setAudioBlobUrl(null);
    sound.playClick(440);
  };

  // Export encrypted .resq packet file
  const handleExportOfflinePacket = () => {
    const packetData = {
      protocol: 'RESQGRID_IN865_OFFLINE_V2',
      scenario: selectedScenario.title,
      bountyInr: bountyAmountInr,
      cryptoHash: cryptoHash,
      ciphertext: encryptedPayload,
      coordinates: { lat: realGps.lat, lng: realGps.lng },
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(packetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RESQ_DISTRESS_${Date.now()}.resq`;
    a.click();
    sound.playClick(900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Modal Backdrop with Click to Close */}
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
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#031519] border-2 border-[#b6f014]/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(182,240,20,0.15)] overflow-hidden"
        >
          {/* Top Bar Header with Clear In-View Close Button */}
          <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#041c22] border-b border-white/15 z-20">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#b6f014] animate-pulse" />
                OFF_GRID_MESH_EMERGENCY_DISPATCH_TERMINAL
              </span>
            </div>

            <button
              onClick={() => {
                sound.playClick(500);
                onClose();
              }}
              aria-label="Close emergency simulator modal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/20 hover:border-rose-400/50 transition-all font-mono text-xs cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-[#b6f014]" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Telemetry Status Control Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Airplane Mode Toggle */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      Airplane Mode
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      0 BARS (OFFLINE)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={airplaneMode}
                  onChange={(e) => {
                    setAirplaneMode(e.target.checked);
                    sound.playClick(600);
                  }}
                  className="toggle accent-[#b6f014] w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Radio ISM Band */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
                    Frequency Band
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    IN865 (865MHz) + BLE 5.3
                  </span>
                </div>
              </div>

              {/* Smart Escrow Locked in Rupees */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
                    Smart Escrow
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    ₹{bountyAmountInr.toLocaleString('en-IN')} INR LOCKED
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Scenario Selector */}
            <div>
              <label className="text-xs font-mono text-slate-400 font-bold uppercase block mb-3">
                1. Select Simulated Breakdown Condition:
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
                        <span className="text-slate-400">Bounty: ₹{scen.suggestedBountyInr.toLocaleString('en-IN')}</span>
                        <span className="text-[#b6f014] font-bold">{scen.estimatedHops} Hops</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real Voice Dispatch Memo Recorder */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    Microphone Voice Dispatch Memo
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isRecordingAudio
                      ? '🔴 Recording audio from microphone...'
                      : audioBlobUrl
                      ? '✅ Voice note recorded and attached to packet'
                      : 'Record real spoken voice note for responders'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isRecordingAudio ? (
                  <button
                    onClick={startVoiceRecording}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/40 text-xs font-mono transition-all cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Record Voice Note</span>
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceRecording}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-mono font-bold animate-pulse cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {audioBlobUrl && (
                  <audio src={audioBlobUrl} controls className="h-8 max-w-[180px]" />
                )}
              </div>
            </div>

            {/* Live Multi-Hop Telemetry Terminal Visualizer */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  TELEMETRY PIPELINE & HOP MONITOR
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
                    &gt; Radio idle. Click "Send Distress Beacon" below to broadcast encrypted offline packets across passing vehicles.
                  </p>
                )}
                {stage === 'encrypting' && (
                  <p className="text-cyan-400 animate-pulse">
                    &gt; [AES-256-GCM] Packetizing distress payload: SHA-256: {cryptoHash.slice(0, 24)}... (0 bars detected).
                  </p>
                )}
                {stage === 'hopping' && (
                  <>
                    <p className="text-yellow-400">
                      &gt; [BLE 5.3 BROADCAST] Hop {currentHop}/3 caught by passing Mahindra Thar 4x4 (RSSI: -58 dBm).
                    </p>
                    <p className="text-slate-400">
                      &gt; Cross-tab broadcast relayed across local mesh network bus.
                    </p>
                  </>
                )}
                {(stage === 'escrow_locked' || stage === 'dispatched' || stage === 'rescued') && (
                  <>
                    <p className="text-purple-300">
                      &gt; [ESCROW LOCKED] ₹{bountyAmountInr.toLocaleString('en-IN')} INR collateral verified via community multi-sig.
                    </p>
                    <p className="text-[#b6f014]">
                      &gt; [DISPATCH CONFIRMED] Unit 08 (Force Gurkha 4x4 - WARN Winch) en route. GPS ETA: {etaSeconds}s.
                    </p>
                  </>
                )}
                {stage === 'rescued' && (
                  <p className="text-emerald-400 font-bold">
                    &gt; [RESCUE ACCOMPLISHED] Vehicle recovered! Smart contract bounty of ₹{bountyAmountInr.toLocaleString('en-IN')} released to responder.
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

              <button
                onClick={handleExportOfflinePacket}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 font-mono text-xs border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export .resq Packet
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

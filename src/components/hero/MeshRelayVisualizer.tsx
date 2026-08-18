import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Truck, Mountain, ShieldCheck, RefreshCw, Signal } from 'lucide-react';
import { sound } from '../../utils/soundEngine';

interface NodeStep {
  id: string;
  name: string;
  role: string;
  tech: string;
  rssi: string;
  icon: React.ElementType;
  x: number;
  y: number;
  color: string;
}

const nodes: NodeStep[] = [
  {
    id: 'origin',
    name: 'Stranded SUV',
    role: 'SOS Origin (0 Bars)',
    tech: 'BLE 5.3 Beacon',
    rssi: '-45 dBm',
    icon: Radio,
    x: 12,
    y: 65,
    color: '#ff5b37',
  },
  {
    id: 'peer1',
    name: 'Passing 4x4 Rig',
    role: 'Peer Relay Hop #1',
    tech: 'Mesh BLE Hopping',
    rssi: '-68 dBm',
    icon: Truck,
    x: 38,
    y: 25,
    color: '#00f0ff',
  },
  {
    id: 'tower',
    name: 'Ridge LoRa Node',
    role: 'Sub-GHz Relay #2',
    tech: 'LoRa 915MHz (18km)',
    rssi: '-82 dBm',
    icon: Mountain,
    x: 66,
    y: 68,
    color: '#9855ff',
  },
  {
    id: 'dispatch',
    name: 'Rescue Fleet Unit',
    role: 'Responder Dispatched',
    tech: 'Escrow Locked',
    rssi: '-54 dBm',
    icon: ShieldCheck,
    x: 88,
    y: 30,
    color: '#b6f014',
  },
];

export const MeshRelayVisualizer: React.FC = () => {
  const [activeHop, setActiveHop] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const packetTelemetry = {
    packetId: '0x7F4A-98C2',
    cipher: 'AES-256-GCM',
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveHop((prev) => {
        const next = (prev + 1) % nodes.length;
        sound.playMeshHop(next + 1);
        if (next === nodes.length - 1) {
          sound.playSuccessChime();
        }
        return next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNodeClick = (index: number) => {
    setActiveHop(index);
    sound.playClick(750 + index * 100);
  };

  const handleRestart = () => {
    setActiveHop(0);
    sound.playRadarPing();
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#031519]/90 border border-white/10 p-4 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#b6f014] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Live Mesh Hop Simulation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                0-DATA RELAY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Stranded in dead-zone $\rightarrow$ Multi-hop telemetry $\rightarrow$ Community Rescue Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Re-hop
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 text-xs font-mono text-[#b6f014] bg-[#b6f014]/10 border border-[#b6f014]/30 rounded-lg transition-colors hover:bg-[#b6f014]/20"
          >
            {isPlaying ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Interactive Mesh Map Graphic Area */}
      <div className="relative h-64 sm:h-72 w-full my-4 rounded-xl bg-[#011013] border border-cyan-950/80 overflow-hidden">
        {/* Subtle grid lines in canvas */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Connecting Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Path 0 to 1 */}
          <line
            x1="12%"
            y1="65%"
            x2="38%"
            y2="25%"
            stroke={activeHop >= 1 ? '#00f0ff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={activeHop >= 1 ? '2.5' : '1.5'}
            strokeDasharray={activeHop >= 1 ? '4 4' : '6 6'}
            className={activeHop >= 1 ? 'animate-dash' : ''}
          />
          {/* Path 1 to 2 */}
          <line
            x1="38%"
            y1="25%"
            x2="66%"
            y2="68%"
            stroke={activeHop >= 2 ? '#9855ff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={activeHop >= 2 ? '2.5' : '1.5'}
            strokeDasharray={activeHop >= 2 ? '4 4' : '6 6'}
            className={activeHop >= 2 ? 'animate-dash' : ''}
          />
          {/* Path 2 to 3 */}
          <line
            x1="66%"
            y1="68%"
            x2="88%"
            y2="30%"
            stroke={activeHop >= 3 ? '#b6f014' : 'rgba(255,255,255,0.15)'}
            strokeWidth={activeHop >= 3 ? '3' : '1.5'}
            strokeDasharray={activeHop >= 3 ? '4 4' : '6 6'}
            className={activeHop >= 3 ? 'animate-dash' : ''}
          />
        </svg>

        {/* Interactive Nodes */}
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isCurrent = activeHop === index;
          const isPassed = activeHop >= index;

          return (
            <motion.div
              key={node.id}
              onClick={() => handleNodeClick(index)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.15 }}
              className="absolute cursor-pointer select-none group z-10"
            >
              {/* Pulsing beacon ring when active */}
              {isCurrent && (
                <div
                  className="absolute -inset-3 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: node.color }}
                />
              )}

              {/* Node Icon Circle */}
              <div
                className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isCurrent
                    ? 'border-2 ring-4 ring-white/20'
                    : isPassed
                    ? 'border border-white/40'
                    : 'border border-white/10 opacity-60'
                }`}
                style={{
                  backgroundColor: isCurrent ? node.color : '#041c22',
                  color: isCurrent ? '#041c22' : node.color,
                  boxShadow: isCurrent ? `0 0 24px ${node.color}` : 'none',
                }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>

              {/* Node Label Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-white/15 px-2.5 py-1 rounded-md text-center pointer-events-none">
                <p className="text-[11px] font-heading font-bold text-white">{node.name}</p>
                <p className="text-[9px] font-mono text-slate-400">{node.tech}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Real-time Diagnostic Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px] font-mono bg-black/30 rounded-lg p-2.5 border border-white/5">
        <div className="flex flex-col">
          <span className="text-slate-400">ACTIVE PACKET:</span>
          <span className="text-[#b6f014] font-bold">{packetTelemetry.packetId}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400">CURRENT HOP:</span>
          <span className="text-cyan-300 font-bold">
            Hop {activeHop + 1} of 4 ({nodes[activeHop].name})
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400">ENCRYPTION:</span>
          <span className="text-purple-300 font-bold">{packetTelemetry.cipher}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400">SIGNAL RSSI:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Signal className="w-3 h-3 text-[#b6f014]" />
            {nodes[activeHop].rssi}
          </span>
        </div>
      </div>
    </div>
  );
};

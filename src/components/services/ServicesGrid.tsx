import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Truck, Sparkles, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { StickerTag } from '../common/StickerTag';
import { PushPin } from '../common/PushPin';
import type { PushPinColor } from '../common/PushPin';
import { FoldedPaperCard } from '../common/FoldedPaperCard';
import { sound } from '../../utils/soundEngine';

interface ServiceItem {
  id: string;
  tagTitle: string;
  pinColor: PushPinColor;
  icon: React.ElementType;
  fullTitle: string;
  category: string;
  summary: string;
  specs: string[];
  techStack: string;
  actionLabel: string;
}

const servicesList: ServiceItem[] = [
  {
    id: 'mesh-sos',
    tagTitle: 'Zero-Signal Mesh SOS',
    pinColor: 'cyan',
    icon: Radio,
    fullTitle: 'Offline IN865 LoRa & BLE 5.3 Telemetry Dispatch',
    category: 'INDIAN ISM BAND RADIO PROTOCOL',
    summary:
      'Broadcasts emergency distress beacon packets across deadzones without Airtel/Jio coverage. Packets hop invisibly through passing vehicles and high-altitude ridge repeater towers.',
    specs: [
      'Sub-GHz 865-867 MHz (IN865 License-Free Band)',
      'BLE 5.3 Long-Range Coded PHY beaconing',
      'End-to-End AES-256-GCM encrypted payload',
      'Automatic TTL hop decrement with flood prevention',
    ],
    techStack: 'IN865 LoRa / BLE 5.3 / Meshtastic Open Protocol',
    actionLabel: 'Test Mesh Hop',
  },
  {
    id: 'p2p-winch',
    tagTitle: 'P2P Winch & Jump',
    pinColor: 'magenta',
    icon: Truck,
    fullTitle: 'Peer-to-Peer Community Bounty Escrow in INR (₹)',
    category: 'SMART CONTRACT ESCROW',
    summary:
      'Direct peer-to-peer assistance for high-centered vehicles, sand dunes, monsoon mud ruts, and dead batteries. Flat community bounties locked in trustless escrow.',
    specs: [
      '12,000lb+ synthetic winch equipped Thar & Gurkha responders',
      '2000A LiFePO4 cold-crank Himalayan jump packs',
      'Zero predatory price gouging or hidden towing fees',
      'Multi-sig escrow release on verified GPS handshake',
    ],
    techStack: 'Escrow Smart Contract / Zero-Knowledge Proofs',
    actionLabel: 'Calculate Escrow',
  },
  {
    id: 'vision-ai',
    tagTitle: 'On-Device Vision AI',
    pinColor: 'orange',
    icon: Sparkles,
    fullTitle: 'Local WebGL/CoreML Vehicle Diagnostics',
    category: 'EDGE COMPUTER VISION',
    summary:
      'Point your phone camera at instrument cluster warning lights, blown fuse boxes, or under-bonnet cooling hoses. AI model runs 100% locally on-device without internet.',
    specs: [
      'Identifies 800+ OBD-II DTC codes visually',
      'Fuse block pinout AR overlay & swap assistant',
      'Safe-to-drive distance & cooling time estimator',
      'Offline model footprint under 14MB quantized',
    ],
    techStack: 'TensorFlow Lite / WebGL On-Device Inference',
    actionLabel: 'Launch Vision Scanner',
  },
  {
    id: 'gps-beacon',
    tagTitle: 'NavIC / GPS Beacon',
    pinColor: 'purple',
    icon: Compass,
    fullTitle: 'Zero-Knowledge Offline Location Telemetry',
    category: 'ISRO NavIC + GNSS GEOLOCATION',
    summary:
      'Encrypted breadcrumb coordinate logging with ISRO NavIC satellite compatibility. Responders receive precise dead-reckoned coordinates even inside deep mountain gorges.',
    specs: [
      'Dual-Frequency NavIC L5/S-Band + GPS L1/L5 high-precision',
      'Inertial dead-reckoning fallback via phone IMU gyro',
      'Ephemeral one-time key coordinate decryption',
      'Sub-meter accuracy in rugged Himalayan terrain',
    ],
    techStack: 'ISRO NavIC / GPS L1/L5 / Inertial IMU Filtering',
    actionLabel: 'View Beacon Schema',
  },
];

interface ServicesGridProps {
  onOpenSOSModal: () => void;
  onOpenVisionModal: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onOpenSOSModal,
  onOpenVisionModal,
}) => {
  const [activeService, setActiveService] = useState<ServiceItem>(servicesList[0]);

  const handleSelectService = (service: ServiceItem) => {
    setActiveService(service);
    sound.playPaperCard();
  };

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      {/* Section Header with Neon Lime Sticker Tag matching Reference */}
      <div className="flex flex-col items-center">
        <StickerTag
          text="services"
          subtitle="tactical capabilities"
          variant="lime"
          rotate={2}
          size="xl"
          hasPin={true}
          pinColor="magenta"
          pinPos="top-left"
          hasDogEar={true}
          className="mb-6"
        />

        <p className="font-heading text-lg sm:text-2xl text-slate-200 font-semibold max-w-xl">
          — Not just towing, <br />
          <span className="text-slate-400 font-normal">
            but resilient decentralized survival protocols for Indian roads.
          </span>
        </p>
      </div>

      {/* Floating Horizontal Ribbon of Tactile White Sticker Cards matching Reference Layout */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {servicesList.map((service, index) => {
          const Icon = service.icon;
          const rotations = [-2.5, 1.8, -1.8, 2.2];
          const rot = rotations[index % rotations.length];

          return (
            <motion.div
              key={service.id}
              onClick={() => handleSelectService(service)}
              whileHover={{
                scale: 1.07,
                rotate: rot + (rot >= 0 ? 3 : -3),
                y: -6,
                transition: { type: 'spring', stiffness: 320, damping: 14 },
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transform: `rotate(${rot}deg)` }}
              className="relative cursor-pointer select-none group"
            >
              {/* PushPin on Top */}
              <div className="absolute -top-3 left-4 z-20">
                <PushPin color={service.pinColor} size="md" />
              </div>

              {/* Tactile White Sticker Body with Folded Corner */}
              <div
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)',
                }}
                className="bg-white text-slate-950 px-6 py-4 rounded-md shadow-[0_16px_32px_rgba(0,0,0,0.45)] border border-slate-200 flex items-center gap-3 transition-shadow group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{
                    backgroundColor:
                      service.pinColor === 'cyan'
                        ? '#0891b2'
                        : service.pinColor === 'magenta'
                        ? '#db2777'
                        : service.pinColor === 'orange'
                        ? '#ea580c'
                        : '#7e22ce',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-left">
                  <span className="font-heading font-black text-base sm:text-lg block tracking-tight">
                    {service.tagTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Fold Flap */}
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                  clipPath: 'polygon(0 0, 0 100%, 100% 0)',
                  transform: 'rotate(180deg)',
                  boxShadow: '-2px -2px 5px rgba(0,0,0,0.3)',
                }}
                className="absolute bottom-0 right-0 pointer-events-none z-10"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Featured Service Interactive Detail Card */}
      <div className="mt-16 max-w-4xl mx-auto">
        <FoldedPaperCard
          cardBg="bg-white"
          textColor="text-slate-900"
          foldSize="lg"
          foldTheme="lime"
          pinColor="lime"
          pinPosition="top-left"
          rotate={-0.5}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-slate-950 text-[#b6f014]">
                  {activeService.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {activeService.techStack}
                </span>
              </div>

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 mt-2">
                {activeService.fullTitle}
              </h3>

              <p className="font-sans text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
                {activeService.summary}
              </p>

              {/* Specs List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-200">
                {activeService.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button for Selected Service */}
            <div className="flex flex-col items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  if (activeService.id === 'vision-ai') {
                    onOpenVisionModal();
                  } else {
                    onOpenSOSModal();
                  }
                }}
                className="w-full md:w-auto px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-[#b6f014] font-heading font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>{activeService.actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </FoldedPaperCard>
      </div>
    </section>
  );
};

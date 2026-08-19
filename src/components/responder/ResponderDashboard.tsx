import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Bluetooth,
  Wallet,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { meshBus } from '../../utils/realMeshBus';
import type { LiveDistressBeacon, MeshPeerMessage } from '../../utils/realMeshBus';
import { getRealDeviceLocation, calculateDistanceKm, DEFAULT_FALLBACK_LOCATION } from '../../utils/geoEngine';
import type { GeoLocationState } from '../../utils/geoEngine';
import { sound } from '../../utils/soundEngine';

export const ResponderDashboard: React.FC = () => {
  const [responderLocation, setResponderLocation] = useState<GeoLocationState>(DEFAULT_FALLBACK_LOCATION);
  const [activeBeacons, setActiveBeacons] = useState<LiveDistressBeacon[]>([
    {
      id: 'beacon-live-01',
      senderNodeId: 'NODE-7F4A',
      senderName: 'Tenzing (Scorpio-N)',
      vehicle: 'Mahindra Scorpio-N 4Xplor',
      category: 'electrical',
      issueTitle: '12V Battery Cold-Soak Failure at Khardung La',
      severity: 'Urgent',
      lat: 34.2787,
      lng: 77.6047,
      altitude: 5359,
      bountyInr: 1200,
      timestamp: Date.now() - 1000 * 60 * 4,
      encryptedHash: '0x9a8f4c2e...b614',
      status: 'BROADCASTING',
      hops: 2,
    },
    {
      id: 'beacon-live-02',
      senderNodeId: 'NODE-3C99',
      senderName: 'Rohit (Thar 4x4)',
      vehicle: 'Mahindra Thar Petrol AT',
      category: 'traction',
      issueTitle: 'High-Centered on Sam Sand Dune Ridge',
      severity: 'Critical',
      lat: 26.8282,
      lng: 70.5122,
      altitude: 240,
      bountyInr: 3500,
      timestamp: Date.now() - 1000 * 60 * 12,
      encryptedHash: '0x3f1b72aa...00f0',
      status: 'BROADCASTING',
      hops: 3,
    },
  ]);

  const [walletBalanceInr, setWalletBalanceInr] = useState<number>(8400);
  const [bleScanning, setBleScanning] = useState<boolean>(false);
  const [foundBleDevice, setFoundBleDevice] = useState<string | null>(null);

  // Equipment readiness checklist
  const [gearInventory, setGearInventory] = useState({
    winch: true,
    jumpBox: true,
    tireKit: true,
    siliconeTape: true,
    loraNode: true,
  });

  // Query real GPS location
  useEffect(() => {
    getRealDeviceLocation().then((loc) => {
      setResponderLocation(loc);
    });

    // Subscribe to cross-tab live mesh messages
    const unsubscribe = meshBus.subscribe((msg: MeshPeerMessage) => {
      if (msg.type === 'SOS_BEACON' && msg.beacon) {
        sound.playSosAlarm();
        setActiveBeacons((prev) => {
          const exists = prev.some((b) => b.id === msg.beacon!.id);
          if (exists) return prev;
          return [msg.beacon!, ...prev];
        });
      } else if (msg.type === 'SOS_ACCEPTED' && msg.beacon) {
        setActiveBeacons((prev) =>
          prev.map((b) => (b.id === msg.beacon!.id ? { ...b, status: 'ACCEPTED', acceptedByResponder: msg.senderName } : b))
        );
      } else if (msg.type === 'SOS_RESOLVED' && msg.beacon) {
        setActiveBeacons((prev) =>
          prev.map((b) => (b.id === msg.beacon!.id ? { ...b, status: 'RESCUED' } : b))
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptMission = (beaconId: string) => {
    sound.playRadioSquelch();
    meshBus.acceptDistressBeacon(beaconId, 'Unit 08 (Overland Fleet)');
    setActiveBeacons((prev) =>
      prev.map((b) => (b.id === beaconId ? { ...b, status: 'ACCEPTED', acceptedByResponder: 'Unit 08 (You)' } : b))
    );
  };

  const handleCompleteRescue = (beacon: LiveDistressBeacon) => {
    sound.playSuccessChime();
    meshBus.resolveRescue(beacon.id);
    setWalletBalanceInr((prev) => prev + beacon.bountyInr);
    setActiveBeacons((prev) =>
      prev.map((b) => (b.id === beacon.id ? { ...b, status: 'RESCUED' } : b))
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b6f014', '#00f0ff', '#ffffff'],
    });
  };

  const handleScanBluetooth = async () => {
    setBleScanning(true);
    sound.playRadarPing();
    const result = await meshBus.scanRealBluetoothDevices();
    setBleScanning(false);
    if (result) {
      setFoundBleDevice(`${result.name} (${result.id.slice(0, 10)}...)`);
      sound.playSuccessChime();
    }
  };

  const toggleGear = (key: keyof typeof gearInventory) => {
    setGearInventory((prev) => ({ ...prev, [key]: !prev[key] }));
    sound.playClick(650);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      {/* Top Banner & Wallet Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-[#031519]/90 border border-white/15 backdrop-blur-xl shadow-2xl mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#b6f014] text-[#041c22] flex items-center justify-center font-black shadow-[0_0_20px_rgba(182,240,20,0.4)]">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                Responder Fleet Radar
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                ACTIVE PATROL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Base GPS: {responderLocation.lat}° N, {responderLocation.lng}° E</span>
              {responderLocation.isRealGps && (
                <span className="text-[#b6f014] font-bold">(Real Device Satellite Fix)</span>
              )}
            </p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/40 border border-white/10">
          <Wallet className="w-5 h-5 text-[#b6f014]" />
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block">ESCROW EARNINGS</span>
            <span className="text-lg font-black text-emerald-400">
              ₹{walletBalanceInr.toLocaleString('en-IN')} INR
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Distress Signals Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              LIVE DISTRESS SIGNALS BROADCAST FEED ({activeBeacons.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              CROSS-TAB MESH ACTIVE
            </span>
          </div>

          <div className="space-y-4">
            {activeBeacons.map((beacon) => {
              const distanceKm = calculateDistanceKm(
                responderLocation.lat,
                responderLocation.lng,
                beacon.lat,
                beacon.lng
              );

              return (
                <div
                  key={beacon.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    beacon.status === 'RESCUED'
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                      : beacon.status === 'ACCEPTED'
                      ? 'bg-cyan-950/30 border-cyan-500/40'
                      : 'bg-slate-900/80 border-[#b6f014]/50 shadow-[0_0_20px_rgba(182,240,20,0.15)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          beacon.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {beacon.severity}
                      </span>
                      <span className="font-heading font-black text-white text-base sm:text-lg">
                        {beacon.issueTitle}
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-emerald-400">
                        ₹{beacon.bountyInr.toLocaleString('en-IN')} INR
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Locked in Escrow
                      </span>
                    </div>
                  </div>

                  {/* Beacon Telemetry Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs font-mono">
                    <div className="p-2 rounded bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">DRIVER & VEHICLE</span>
                      <strong className="text-slate-200">{beacon.senderName}</strong>
                    </div>
                    <div className="p-2 rounded bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">DISTANCE</span>
                      <strong className="text-cyan-300">~{distanceKm} km away</strong>
                    </div>
                    <div className="p-2 rounded bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">GPS FIX</span>
                      <span className="text-slate-300">{beacon.lat.toFixed(3)}°, {beacon.lng.toFixed(3)}°</span>
                    </div>
                    <div className="p-2 rounded bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">STATUS</span>
                      <strong
                        className={
                          beacon.status === 'RESCUED'
                            ? 'text-emerald-400'
                            : beacon.status === 'ACCEPTED'
                            ? 'text-cyan-400'
                            : 'text-[#b6f014]'
                        }
                      >
                        {beacon.status}
                      </strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      ENCRYPTED HASH: {beacon.encryptedHash}
                    </span>

                    <div className="flex items-center gap-2">
                      {beacon.status === 'BROADCASTING' && (
                        <button
                          onClick={() => handleAcceptMission(beacon.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#b6f014] hover:bg-[#d4ff00] text-[#041c22] font-heading font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Accept Mission & Deploy</span>
                        </button>
                      )}

                      {beacon.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleCompleteRescue(beacon)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#041c22] font-heading font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify Handshake & Claim Bounty</span>
                        </button>
                      )}

                      {beacon.status === 'RESCUED' && (
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Bounty Released</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hardware & BLE Peripheral Scanner */}
        <div className="lg:col-span-4 space-y-6">
          {/* Equipment Inventory */}
          <div className="p-5 rounded-2xl bg-[#031519] border border-white/15 shadow-xl">
            <span className="text-xs font-mono font-bold text-white uppercase block mb-3">
              On-Board Gear Checklist:
            </span>
            <div className="space-y-2 text-xs font-mono">
              {[
                { key: 'winch' as const, label: '12,000lb Synthetic Winch' },
                { key: 'jumpBox' as const, label: '2000A LiFePO4 Jump Box' },
                { key: 'tireKit' as const, label: 'Tire Plug & 12V Air Pump' },
                { key: 'siliconeTape' as const, label: 'Self-Fusing Silicone Tape' },
                { key: 'loraNode' as const, label: 'IN865 LoRa Repeater Dongle' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleGear(item.key)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    gearInventory[item.key]
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-black/30 border-white/10 text-slate-500'
                  }`}
                >
                  <span>{item.label}</span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      gearInventory[item.key] ? 'text-[#b6f014]' : 'opacity-30'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Web Bluetooth Peripheral Scanner */}
          <div className="p-5 rounded-2xl bg-[#031519] border border-white/15 shadow-xl">
            <span className="text-xs font-mono font-bold text-white uppercase block mb-2">
              Web Bluetooth Peripheral Link:
            </span>
            <p className="text-[11px] text-slate-400 mb-3">
              Pair your phone with local Meshtastic radio dongles or vehicle OBD-II BLE scanners.
            </p>

            <button
              onClick={handleScanBluetooth}
              disabled={bleScanning}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/40 rounded-xl font-mono text-xs transition-all cursor-pointer"
            >
              <Bluetooth className="w-4 h-4" />
              <span>{bleScanning ? 'Searching BLE...' : 'Scan Nearby BLE Device'}</span>
            </button>

            {foundBleDevice && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#b6f014]" />
                <span>Connected: {foundBleDevice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

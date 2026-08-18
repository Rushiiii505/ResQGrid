// ResQGrid Mock Data & Diagnostic Telemetry - Indian Backcountry & Highway Rescue Mesh

export interface MeshNode {
  id: string;
  name: string;
  type: 'vehicle' | 'lora_tower' | 'responder' | 'satellite';
  lat: number;
  lng: number;
  battery: number;
  hops: number;
  rssi: number; // dBm
  signal: 'mesh-ble' | 'lora-865' | 'navic-satellite';
}

export interface BreakdownScenario {
  id: string;
  title: string;
  category: 'electrical' | 'mechanical' | 'traction' | 'thermal' | 'diagnostic';
  severity: 'Critical' | 'Urgent' | 'Standard';
  description: string;
  recommendedGear: string[];
  suggestedBountyInr: number;
  estimatedHops: number;
  obdCode?: string;
  iconName: string;
}

export interface RescueCase {
  id: string;
  title: string;
  location: string;
  coordinates: string;
  vehicle: string;
  issue: string;
  obdCode?: string;
  dispatchTimeMin: number;
  hopsRequired: number;
  escrowBountyInr: number;
  responderName: string;
  responderVehicle: string;
  responderRating: number;
  date: string;
  imageUrl: string;
  tagColor: 'lime' | 'cyan' | 'purple' | 'orange';
  summary: string;
}

export interface OBDDiagnosticItem {
  code: string;
  title: string;
  system: string;
  severity: 'High' | 'Medium' | 'Low';
  symptoms: string[];
  immediateAction: string;
  safeToDriveKm: number;
  partNeeded: string;
  estCost: string;
}

// Active nearby mesh nodes (Indian Network)
export const activeMeshNodes: MeshNode[] = [
  {
    id: 'node-thar-99',
    name: 'Mahindra Thar 4x4 (Relay Peer)',
    type: 'vehicle',
    lat: 34.1526,
    lng: 77.5771,
    battery: 95,
    hops: 1,
    rssi: -58,
    signal: 'mesh-ble',
  },
  {
    id: 'node-lora-pass',
    name: 'Khardung La LoRa Node #08',
    type: 'lora_tower',
    lat: 34.2787,
    lng: 77.6047,
    battery: 100,
    hops: 2,
    rssi: -74,
    signal: 'lora-865',
  },
  {
    id: 'node-gurkha-rescue',
    name: 'Force Gurkha Heavy Winch (Unit 04)',
    type: 'responder',
    lat: 34.1702,
    lng: 77.5855,
    battery: 91,
    hops: 3,
    rssi: -69,
    signal: 'mesh-ble',
  },
  {
    id: 'node-navic-gateway',
    name: 'ISRO NavIC / Direct Satellite Gateway',
    type: 'satellite',
    lat: 34.3101,
    lng: 77.6322,
    battery: 100,
    hops: 4,
    rssi: -88,
    signal: 'navic-satellite',
  },
];

// Breakdown scenarios for the Emergency Playground
export const breakdownScenarios: BreakdownScenario[] = [
  {
    id: 'battery-dead',
    title: '12V Battery Cold-Soak Failure at High Altitude',
    category: 'electrical',
    severity: 'Urgent',
    description: 'Sub-zero overnight freeze in Ladakh valley dropped voltage to 8.9V. Starter solenoid clicking with zero engine crank.',
    recommendedGear: ['2000A LiFePO4 Jump Starter', 'Heavy-Gauge Booster Cables', 'Terminal Brush'],
    suggestedBountyInr: 1200,
    estimatedHops: 2,
    obdCode: 'P0562',
    iconName: 'Zap',
  },
  {
    id: 'stuck-sand-mud',
    title: 'High-Centered in Thar Desert Sand Rut',
    category: 'traction',
    severity: 'Critical',
    description: 'Vehicle belly resting on dune crest outside Jaisalmer. 0 cellular reception. Needs 12,000lb winch or kinetic snatch recovery.',
    recommendedGear: ['12,000lb Synthetic Winch', 'Sand Recovery Boards', 'ARB Soft Shackles'],
    suggestedBountyInr: 3500,
    estimatedHops: 3,
    iconName: 'Truck',
  },
  {
    id: 'overheat-ghats',
    title: 'Blown Coolant Hose on Steep Western Ghats Incline',
    category: 'thermal',
    severity: 'Urgent',
    description: 'Coolant temperature crossed 115°C climbing steep hairpin turns. Upper radiator hose split with heavy steam emission.',
    recommendedGear: ['Self-Fusing Silicone Tape', '5L Distilled Coolant', 'Jubilee Hose Clamps'],
    suggestedBountyInr: 1800,
    estimatedHops: 2,
    obdCode: 'P0217',
    iconName: 'Flame',
  },
  {
    id: 'blown-fuse-relay',
    title: 'Blown Fuel Pump 20A Micro Fuse in Remote Canyon',
    category: 'electrical',
    severity: 'Urgent',
    description: 'Engine cranks vigorously but refuses to combust. Vision AI identified severed 20A micro-blade fuse in main engine bay fuse box.',
    recommendedGear: ['Micro/Mini Automotive Fuse Kit', 'Needle-Nose Pliers', '12V Test Lamp'],
    suggestedBountyInr: 750,
    estimatedHops: 1,
    obdCode: 'P0627',
    iconName: 'Cpu',
  },
  {
    id: 'flat-spiti-rocks',
    title: 'Dual Sidewall Cut on Spiti Valley Riverbed Stones',
    category: 'traction',
    severity: 'Critical',
    description: 'Sharp slate stones punctured both left tires in riverbed crossing. Only 1 spare available. Needs vulcanizing plug cord & 12V high-flow air pump.',
    recommendedGear: ['Heavy-Duty Tyre Plug Kit', 'Dual-Cylinder 12V Air Compressor', 'Hydraulic Bottle Jack'],
    suggestedBountyInr: 2200,
    estimatedHops: 3,
    iconName: 'Wrench',
  },
];

// OBD-II Diagnostic Database for Vision AI
export const obdDatabase: Record<string, OBDDiagnosticItem> = {
  P0562: {
    code: 'P0562',
    title: 'System Low Voltage (< 10.5V)',
    system: 'Battery & Alternator Electrical',
    severity: 'Medium',
    symptoms: ['Dim digital speedometer', 'Weak starter motor crank', 'Infotainment resets during ignition'],
    immediateAction: 'Do not switch off the vehicle if idling. Inspect alternator serpentine belt tension and clean battery terminal lead sulfate.',
    safeToDriveKm: 15,
    partNeeded: '12V 65Ah Exide/Amaron Battery or Alternator Carbon Brushes',
    estCost: '₹3,200 - ₹6,500',
  },
  P0300: {
    code: 'P0300',
    title: 'Random / Multi-Cylinder Engine Misfire',
    system: 'Ignition & CRDi Fuel Injection',
    severity: 'High',
    symptoms: ['Severe engine shaking under acceleration', 'Flashing Check Engine warning lamp', 'Strong unburnt fuel odor'],
    immediateAction: 'Throttle back immediately to low RPM. Flashing CEL indicates unburned diesel/petrol overheating catalytic converter.',
    safeToDriveKm: 5,
    partNeeded: 'Bosch Ignition Coil / Iridium Spark Plugs / Diesel Fuel Filter',
    estCost: '₹1,400 - ₹4,800',
  },
  P0217: {
    code: 'P0217',
    title: 'Engine Coolant Overtemperature Alert (> 110°C)',
    system: 'Engine Cooling Circuit',
    severity: 'High',
    symptoms: ['Steam escaping from bonnet crease', 'Temperature gauge pinned in Red zone', 'AC stops cooling abruptly'],
    immediateAction: 'Pull over safely and turn off engine immediately. CAUTION: NEVER unscrew radiator cap while hot.',
    safeToDriveKm: 0,
    partNeeded: 'Molded Radiator Hose / Thermostat Valve / 5L Pre-mixed Coolant',
    estCost: '₹650 - ₹2,400',
  },
  P0627: {
    code: 'P0627',
    title: 'Fuel Pump Relay "A" Open Circuit',
    system: 'Fuel Delivery & ECU Relays',
    severity: 'Medium',
    symptoms: ['Starter turns strongly but zero combustion', 'No fuel priming hum from tank when ignition ON', 'Sudden engine cut-off'],
    immediateAction: 'Open engine fuse block, locate 20A EFI fuse, and test by swapping with Horn or Fog Lamp relay temporarily.',
    safeToDriveKm: 0,
    partNeeded: '20A Micro Blade Fuse or 4-Pin 12V Automotive Relay',
    estCost: '₹120 - ₹450',
  },
};

// Real-world rescues for `/ourwork` (Indian Backcountry & Mountain Passes)
export const realWorldRescues: RescueCase[] = [
  {
    id: 'rescue-771',
    title: 'Ladakh Khardung La Pass Freezing Rescue',
    location: 'North Pullu, Khardung La High Pass (17,582 ft)',
    coordinates: '34.2787° N, 77.6047° E',
    vehicle: 'Mahindra Scorpio-N 4Xplor (Sub-Zero Freeze)',
    issue: '0 bars cellular network (42 km from Leh). Diesel fuel waxing and drained 12V dual batteries in -18°C blizzards.',
    obdCode: 'P0562',
    dispatchTimeMin: 16,
    hopsRequired: 3,
    escrowBountyInr: 4500,
    responderName: 'Tenzing "Sherpa" Dorje',
    responderVehicle: 'Mahindra Thar CRDe (2000A Jump Pack & Heated Winch)',
    responderRating: 5.0,
    date: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    tagColor: 'lime',
    summary: 'Decentralized SOS hopped across 2 passing army supply trucks to the North Pullu LoRa relay. Battery jumped and fuel lines primed in 16 minutes.',
  },
  {
    id: 'rescue-582',
    title: 'Thar Desert Sam Sand Dunes Extraction',
    location: 'Sam Sand Dunes, Jaisalmer Border Perimeter',
    coordinates: '26.8282° N, 70.5122° E',
    vehicle: 'Toyota Fortuner 4x4 (High-Centered Axle)',
    issue: 'Stuck in soft shifting dunes with differential resting on rock bed. Complete deadzone 28 km from border highway.',
    obdCode: '4WD-DIFF-LOCK',
    dispatchTimeMin: 21,
    hopsRequired: 2,
    escrowBountyInr: 3200,
    responderName: 'Vikram Singh Rathore',
    responderVehicle: 'Force Gurkha 4x4 (12,000lb Synthetic Winch)',
    responderRating: 4.97,
    date: 'Yesterday at 16:30',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    tagColor: 'cyan',
    summary: 'Local desert rally responder received BLE mesh distress beacon. Deployed kinetic snatch strap and extracted vehicle in under 20 minutes.',
  },
  {
    id: 'rescue-419',
    title: 'Spiti Valley Kaza Riverbed Radiator Repair',
    location: 'Chicham Bridge Outskirts, Spiti Valley',
    coordinates: '32.3276° N, 77.9892° E',
    vehicle: 'Tata Safari Storme 4x4',
    issue: 'Sharp river shale sliced lower coolant bypass pipe. Vision AI camera scan accurately identified hose size & distilled coolant requirements.',
    obdCode: 'P0217',
    dispatchTimeMin: 28,
    hopsRequired: 4,
    escrowBountyInr: 2800,
    responderName: 'Stanzin & Kunzang',
    responderVehicle: 'Isuzu D-Max V-Cross Overland Build',
    responderRating: 4.99,
    date: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    tagColor: 'purple',
    summary: 'Bounty accepted by passing Himalayan expedition overlanders carrying silicone self-amalgamating tape and 5L Prestone coolant.',
  },
  {
    id: 'rescue-304',
    title: 'Western Ghats Munnar Monsoon Hairpin Rut Recovery',
    location: 'Gap Road Deadband, Munnar Ghats',
    coordinates: '10.0889° N, 77.0595° E',
    vehicle: 'Mahindra XUV700 AWD',
    issue: 'Heavy monsoon mud slide washed front wheels into storm gutter. Zero Airtel/Jio signal in deep mountain gorge.',
    dispatchTimeMin: 14,
    hopsRequired: 2,
    escrowBountyInr: 2500,
    responderName: 'Anand Kumar Nair',
    responderVehicle: 'Toyota Hilux 4x4 Dual-Cab',
    responderRating: 5.0,
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    tagColor: 'orange',
    summary: 'Recovered using 4-ton snatch block and heavy recovery tree trunk bridle by nearby plantation fleet responder.',
  },
];

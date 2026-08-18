<div align="center">

# 🛰️ ResQGrid
### Next-Gen Decentralized Emergency Roadside Assistance & Off-Grid Mesh Rescue

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![IN865 ISM Mesh](https://img.shields.io/badge/Radio-IN865_%2B_BLE_5.3-B6F014?style=for-the-badge&logo=bluetooth&logoColor=black)](https://github.com/Rushiiii505/ResQGrid)

<br/>

**ResQGrid** is a production-grade, decentralized emergency roadside rescue platform engineered for complete cellular dead-zones (Himalayan passes, Thar dunes, Spiti riverbeds, Western Ghats). When 4G/5G signals vanish, ResQGrid broadcasts encrypted peer-to-peer distress packets across passing vehicles and mountain repeater towers to dispatch verified local 4x4 community responders.

</div>

---

## 📸 Visual Showcase & Demo

<div align="center">

### ⚡ Hero & Live Mesh Hop Telemetry
![ResQGrid Hero Interface](./public/demo/hero_section.png)

<br/>

### 🚨 Interactive Breakdown Simulator (Airplane Mode & Multi-Hop Relay)
| Step 1: Scenario & Offline Mode | Step 2: Mesh Hop & Escrow Lock |
| :---: | :---: |
| ![Emergency Simulator Modal](./public/demo/emergency_simulator.png) | ![Simulation Progress](./public/demo/simulation_progress.png) |

<br/>

### 🎯 Rescue Confirmation & On-Device Vision AI Diagnostics
| Step 3: Verified Rescue & Payout | Step 4: Local Neural Camera Scanner |
| :---: | :---: |
| ![Simulation Rescued Confetti](./public/demo/simulation_rescued.png) | ![Vision AI Diagnostic Scanner](./public/demo/vision_ai_scanner.png) |

</div>

---

## 🎨 Visual Design System & Aesthetics

Inspired by modern tactile blueprint diagrams and high-contrast creative design:
* **Deep Teal Blueprint Matrix (`#041C20` to `#011215`):** Interactive canvas background with magnetic crosshairs, coordinates, and cursor proximity illumination.
* **Electric Lime (`#B6F014` / `#D4FF00`):** High-contrast neon accents for peelable sticker tags, primary dispatch CTAs, and active beacon rings.
* **Tactile Dog-Ear Paper Cards:** Skeuomorphic folded bottom-right corner flaps with realistic 3D paper drop shadows and spring physics.
* **3D Pushpins & Paper Clips:** Specular metallic highlights in cyan, magenta, lime, orange, and blue.
* **Curving SVG Trajectory Paths:** Organic dashed telemetry vectors meandering across sections with traveling node pulses.

---

## ⚡ Core Feature Modules

### 1. 📡 Zero-Signal IN865 LoRa & BLE 5.3 Telemetry
* Broadcasts emergency packets with **zero cellular reception**.
* Operates on license-free Indian ISM bands (**865–867 MHz**) and BLE 5.3 Long-Range Coded PHY.
* Multi-hop packet propagation through passing 4x4 rigs, commercial trucks, and solar ridge towers.

### 2. 🎮 Interactive Emergency Simulator Playground
* **Airplane Mode Toggle:** Simulate pure offline 0-bar disconnectivity.
* **Scenario Presets:** Select real-world breakdowns (*12V Cold-Soak Battery Freeze*, *Thar Sand Rut High-Center*, *Ghats Coolant Hose Rupture*, *Spiti Riverbed Sidewall Slice*).
* **Live Step-by-Step Dispatch Pipeline:**
  1. Payload encrypted with **AES-256-GCM**.
  2. Multi-hop BLE / LoRa beacon broadcast across 4 peer nodes.
  3. Smart contract escrow collateral locked in Indian Rupees (**₹**).
  4. Responder assigned with live ETA countdown timer.
  5. Rescue verified with celebratory confetti burst and bounty settlement.

### 3. 🔍 On-Device Vision AI Diagnostic Scanner
* 100% offline computer vision inference running locally on-device.
* Diagnoses instrument cluster Check Engine codes (**P0300**, **P0562**, **P0217**, **P0627**), blown engine bay fuse blocks, and corroded battery terminals.
* Provides immediate safety actions, safe-to-drive radius, and required repair parts with INR (₹) estimates.

### 4. 📊 Community Fleet Radius Scrubber & Escrow Calculator
* Interactive distance scrubber to estimate nearby responder density, arrival time, and fair escrow bounties.
* Transparent flat community rates replacing predatory private towing surge fees.

### 5. 🔊 Synthesized Web Audio Telemetry Engine
* Pure Web Audio API sound generator (sonar pings, radar chirps, tactile paper fold clicks, and rescue fanfares) with instant mute controls.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` |
| **Motion Physics** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Audio Engine** | Synthesized Web Audio API |
| **Typography** | Plus Jakarta Sans, Space Grotesk, JetBrains Mono |

---

## 🚀 Getting Started

### Prerequisites
* Node.js `v18.0.0` or higher
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Rushiiii505/ResQGrid.git

# Navigate into project directory
cd ResQGrid

# Install dependencies
npm install

# Launch development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Production Build

```bash
# Compile TypeScript and bundle production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
ResQGrid/
├── public/
│   └── demo/                 # Showcase screenshots & media assets
├── src/
│   ├── components/
│   │   ├── common/           # BlueprintGrid, FoldedPaperCard, PushPin, DecryptedText, StickerTag
│   │   ├── cta/              # FooterCTA with node subscriber
│   │   ├── hero/             # HeroSection & MeshRelayVisualizer
│   │   ├── navigation/       # Glassmorphic Navbar & SFX audio pill
│   │   ├── services/         # Tactile ServicesGrid & capability inspector
│   │   ├── simulator/        # EmergencySimulatorModal playground
│   │   ├── stats/            # WhyUsStats & interactive radius calculator
│   │   ├── vision/           # VisionScannerModal on-device AR scanner
│   │   └── work/             # OurWorkShowcase polaroid rescue records
│   ├── utils/
│   │   ├── mockData.ts       # Indian geography, rescue telemetry, OBD database
│   │   └── soundEngine.ts    # Synthesized Web Audio FX engine
│   ├── App.tsx               # Main application container
│   ├── index.css             # Tailwind v4 theme, dog-ear folds & blueprint tokens
│   └── main.tsx              # React DOM entrypoint
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
Built with ⚡ for off-grid explorers, overlanders, and emergency responders.
</div>

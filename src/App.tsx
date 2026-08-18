import { useState } from 'react';
import { BlueprintGrid } from './components/common/BlueprintGrid';
import { CurvedTrajectoryLines } from './components/common/CurvedTrajectoryLines';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { WhyUsStats } from './components/stats/WhyUsStats';
import { ServicesGrid } from './components/services/ServicesGrid';
import { OurWorkShowcase } from './components/work/OurWorkShowcase';
import { FooterCTA } from './components/cta/FooterCTA';
import { EmergencySimulatorModal } from './components/simulator/EmergencySimulatorModal';
import { VisionScannerModal } from './components/vision/VisionScannerModal';

export function App() {
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState<boolean>(false);

  const handleOpenSOS = () => {
    setIsSOSModalOpen(true);
  };

  const handleOpenVision = () => {
    setIsVisionModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#041c22] text-[#f7f7f8] font-sans selection:bg-[#b6f014] selection:text-[#041c22] overflow-x-hidden">
      {/* Interactive Blueprint Matrix Canvas Background */}
      <BlueprintGrid />

      {/* Organic Dashed Curving SVG Trajectory Lines */}
      <CurvedTrajectoryLines />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Glassmorphic Navbar */}
        <Navbar
          onOpenSOSModal={handleOpenSOS}
          onOpenVisionModal={handleOpenVision}
          activeNodesCount={4}
        />

        {/* Hero Section */}
        <main className="flex-1">
          <HeroSection
            onOpenSOSModal={handleOpenSOS}
            onOpenVisionModal={handleOpenVision}
          />

          {/* Why Us Section with Stacked Folded Paper Cards & Coverage Calculator */}
          <WhyUsStats />

          {/* Services Section with Tactile Sticker Cards */}
          <ServicesGrid
            onOpenSOSModal={handleOpenSOS}
            onOpenVisionModal={handleOpenVision}
          />

          {/* Our Work Section with Polaroid Real-World Rescues */}
          <OurWorkShowcase />

          {/* Footer & CTA Section */}
          <FooterCTA onOpenSOSModal={handleOpenSOS} />
        </main>
      </div>

      {/* Interactive Breakdown Simulator Modal */}
      <EmergencySimulatorModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
      />

      {/* On-Device Vision AI Diagnostics Modal */}
      <VisionScannerModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
        onDispatchAssistance={() => setIsSOSModalOpen(true)}
      />
    </div>
  );
}

export default App;

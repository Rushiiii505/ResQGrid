import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { sound } from '../../utils/soundEngine';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
  enableSpotlight?: boolean;
  spotlightColor?: string;
  onClick?: () => void;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxAngle = 10,
  scale = 1.025,
  enableSpotlight = true,
  spotlightColor = 'rgba(182, 240, 20, 0.12)',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    x.set(xPct * maxAngle);
    y.set(-yPct * maxAngle);

    setSpotlightPos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playPaperCard();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: mouseYSpring,
        rotateY: mouseXSpring,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{ duration: 0.2 }}
      className={`relative cursor-pointer select-none transition-shadow duration-300 ${className}`}
    >
      {/* 3D Content Container */}
      <div style={{ transform: 'translateZ(15px)' }} className="w-full h-full">
        {children}
      </div>

      {/* Dynamic Cursor Spotlight */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(280px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
};

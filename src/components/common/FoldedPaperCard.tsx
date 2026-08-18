import React from 'react';
import { PushPin } from './PushPin';
import { TiltedCard } from './TiltedCard';

interface FoldedPaperCardProps {
  children: React.ReactNode;
  className?: string;
  cardBg?: string;
  textColor?: string;
  foldSize?: 'sm' | 'md' | 'lg';
  foldTheme?: 'paper' | 'lime' | 'cyan' | 'orange' | 'purple' | 'blue';
  pinColor?: 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'yellow' | null;
  pinPosition?: 'top-left' | 'top-right' | 'top-center' | 'none';
  rotate?: number;
  interactiveTilt?: boolean;
  onClick?: () => void;
}

export const FoldedPaperCard: React.FC<FoldedPaperCardProps> = ({
  children,
  className = '',
  cardBg = 'bg-white',
  textColor = 'text-slate-900',
  foldSize = 'md',
  foldTheme = 'paper',
  pinColor = 'magenta',
  pinPosition = 'top-left',
  rotate = 0,
  interactiveTilt = true,
  onClick,
}) => {
  // Fold dimensions based on size
  const foldDimensions = {
    sm: { cut: 20, flapWidth: 20, flapHeight: 20 },
    md: { cut: 28, flapWidth: 28, flapHeight: 28 },
    lg: { cut: 38, flapWidth: 38, flapHeight: 38 },
  }[foldSize];

  // Flap gradient themes
  const flapGradients = {
    paper: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
    lime: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
    cyan: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
    orange: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
    purple: 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)',
    blue: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
  }[foldTheme];

  const clipPathStyle = {
    clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${foldDimensions.cut}px), calc(100% - ${foldDimensions.cut}px) 100%, 0 100%)`,
  };

  const cardContent = (
    <div
      onClick={onClick}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      className={`group relative rounded-[6px] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_24px_48px_-8px_rgba(0,0,0,0.65),0_6px_16px_rgba(0,0,0,0.2)] ${className}`}
    >
      {/* PushPin on Top */}
      {pinPosition !== 'none' && pinColor && (
        <div
          className={`absolute z-30 pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
            pinPosition === 'top-left'
              ? '-top-2.5 -left-2.5'
              : pinPosition === 'top-right'
              ? '-top-2.5 -right-2.5'
              : '-top-2.5 left-1/2 -translate-x-1/2'
          }`}
        >
          <PushPin color={pinColor} size="md" />
        </div>
      )}

      {/* Main Clipped Card Body */}
      <div
        style={clipPathStyle}
        className={`${cardBg} ${textColor} relative w-full h-full p-6 transition-colors duration-200`}
      >
        {children}
      </div>

      {/* Dog-Ear Bottom-Right Fold Flap */}
      <div
        style={{
          width: `${foldDimensions.flapWidth}px`,
          height: `${foldDimensions.flapHeight}px`,
          background: flapGradients,
          clipPath: 'polygon(0 0, 0 100%, 100% 0)',
          transform: 'rotate(180deg)',
          boxShadow: '-3px -3px 8px rgba(0,0,0,0.3)',
        }}
        className="absolute bottom-0 right-0 pointer-events-none z-20 transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );

  if (interactiveTilt) {
    return (
      <TiltedCard maxAngle={8} scale={1.02}>
        {cardContent}
      </TiltedCard>
    );
  }

  return cardContent;
};

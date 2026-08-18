import React from 'react';
import { motion } from 'framer-motion';
import { PushPin } from './PushPin';
import { sound } from '../../utils/soundEngine';

interface StickerTagProps {
  text: string;
  subtitle?: string;
  variant?: 'lime' | 'cyan' | 'purple' | 'white' | 'orange';
  rotate?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasPin?: boolean;
  pinColor?: 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'yellow';
  pinPos?: 'top-left' | 'top-right' | 'top-center';
  hasDogEar?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StickerTag: React.FC<StickerTagProps> = ({
  text,
  subtitle,
  variant = 'lime',
  rotate = -2,
  size = 'lg',
  hasPin = true,
  pinColor = 'magenta',
  pinPos = 'top-left',
  hasDogEar = true,
  className = '',
  onClick,
}) => {
  const variantStyles = {
    lime: {
      bg: 'bg-[#b6f014]',
      text: 'text-[#041c22]',
      border: 'border-2 border-[#d4ff00]',
      shadow: 'shadow-[0_12px_24px_rgba(182,240,20,0.25),0_4px_10px_rgba(0,0,0,0.4)]',
      flapGradient: 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)',
    },
    cyan: {
      bg: 'bg-[#00f0ff]',
      text: 'text-[#041c22]',
      border: 'border-2 border-[#38bdf8]',
      shadow: 'shadow-[0_12px_24px_rgba(0,240,255,0.25),0_4px_10px_rgba(0,0,0,0.4)]',
      flapGradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    },
    purple: {
      bg: 'bg-[#9855ff]',
      text: 'text-white',
      border: 'border-2 border-[#c084fc]',
      shadow: 'shadow-[0_12px_24px_rgba(152,85,255,0.25),0_4px_10px_rgba(0,0,0,0.4)]',
      flapGradient: 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
    },
    orange: {
      bg: 'bg-[#ff5b37]',
      text: 'text-white',
      border: 'border-2 border-[#fb923c]',
      shadow: 'shadow-[0_12px_24px_rgba(255,91,55,0.25),0_4px_10px_rgba(0,0,0,0.4)]',
      flapGradient: 'linear-gradient(135deg, #ea580c 0%, #9a3412 100%)',
    },
    white: {
      bg: 'bg-[#ffffff]',
      text: 'text-[#041c22]',
      border: 'border border-slate-200',
      shadow: 'shadow-[0_12px_24px_rgba(0,0,0,0.35),0_4px_10px_rgba(0,0,0,0.2)]',
      flapGradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
    },
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-lg',
    lg: 'px-7 py-4 text-2xl md:text-3xl font-extrabold',
    xl: 'px-9 py-6 text-3xl md:text-5xl font-black',
  }[size];

  const flapSize = {
    sm: 16,
    md: 22,
    lg: 30,
    xl: 40,
  }[size];

  const clipPath = hasDogEar
    ? `polygon(0 0, 100% 0, 100% calc(100% - ${flapSize}px), calc(100% - ${flapSize}px) 100%, 0 100%)`
    : undefined;

  return (
    <motion.div
      onClick={() => {
        sound.playClick(620, 0.05);
        onClick?.();
      }}
      whileHover={{
        scale: 1.05,
        rotate: rotate + (rotate >= 0 ? 2 : -2),
        transition: { type: 'spring', stiffness: 350, damping: 15 },
      }}
      whileTap={{ scale: 0.96 }}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
      className={`relative inline-flex flex-col items-start cursor-pointer select-none ${variantStyles.shadow} ${className}`}
    >
      {/* PushPin */}
      {hasPin && (
        <div
          className={`absolute z-30 pointer-events-none ${
            pinPos === 'top-left'
              ? '-top-2.5 -left-2.5'
              : pinPos === 'top-right'
              ? '-top-2.5 -right-2.5'
              : '-top-2.5 left-1/2 -translate-x-1/2'
          }`}
        >
          <PushPin color={pinColor} size={size === 'xl' || size === 'lg' ? 'md' : 'sm'} />
        </div>
      )}

      {/* Main Tag Body */}
      <div
        style={{ clipPath }}
        className={`${variantStyles.bg} ${variantStyles.text} ${sizeStyles} font-heading tracking-tight rounded-md flex flex-col justify-center relative overflow-hidden`}
      >
        {/* Subtle diagonal gloss strip */}
        <div className="absolute -top-12 -left-12 w-24 h-48 bg-white/15 rotate-45 pointer-events-none filter blur-sm" />

        <span>{text}</span>
        {subtitle && (
          <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-75 mt-0.5">
            {subtitle}
          </span>
        )}
      </div>

      {/* Dog Ear Flap */}
      {hasDogEar && (
        <div
          style={{
            width: `${flapSize}px`,
            height: `${flapSize}px`,
            background: variantStyles.flapGradient,
            clipPath: 'polygon(0 0, 0 100%, 100% 0)',
            transform: 'rotate(180deg)',
            boxShadow: '-2px -2px 6px rgba(0,0,0,0.35)',
          }}
          className="absolute bottom-0 right-0 pointer-events-none z-20"
        />
      )}
    </motion.div>
  );
};

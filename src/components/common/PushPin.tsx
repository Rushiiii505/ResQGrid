import React from 'react';

export type PushPinColor = 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'yellow' | 'purple';

interface PushPinProps {
  color?: PushPinColor;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<PushPinColor, { bg: string; shadow: string; border: string }> = {
  cyan: {
    bg: 'radial-gradient(circle at 35% 35%, #67e8f9 0%, #06b6d4 50%, #0e7490 100%)',
    shadow: 'rgba(6, 182, 212, 0.4)',
    border: '#22d3ee',
  },
  magenta: {
    bg: 'radial-gradient(circle at 35% 35%, #f472b6 0%, #db2777 50%, #9d174d 100%)',
    shadow: 'rgba(219, 39, 119, 0.4)',
    border: '#f472b6',
  },
  lime: {
    bg: 'radial-gradient(circle at 35% 35%, #bef264 0%, #b6f014 50%, #4d7c0f 100%)',
    shadow: 'rgba(182, 240, 20, 0.4)',
    border: '#d9f99d',
  },
  orange: {
    bg: 'radial-gradient(circle at 35% 35%, #fb923c 0%, #f97316 50%, #c2410c 100%)',
    shadow: 'rgba(249, 115, 22, 0.4)',
    border: '#fed7aa',
  },
  blue: {
    bg: 'radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
    shadow: 'rgba(37, 99, 235, 0.4)',
    border: '#93c5fd',
  },
  purple: {
    bg: 'radial-gradient(circle at 35% 35%, #c084fc 0%, #9855ff 50%, #6b21a8 100%)',
    shadow: 'rgba(152, 85, 255, 0.4)',
    border: '#d8b4fe',
  },
  yellow: {
    bg: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #eab308 50%, #a16207 100%)',
    shadow: 'rgba(234, 179, 8, 0.4)',
    border: '#fef9c3',
  },
};

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const PushPin: React.FC<PushPinProps> = ({
  color = 'lime',
  className = '',
  size = 'md',
}) => {
  const pinColor = colorMap[color] || colorMap.lime;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none pointer-events-none ${sizeMap[size]} ${className}`}
      style={{
        background: pinColor.bg,
        boxShadow: `0 4px 8px rgba(0,0,0,0.5), 0 0 10px ${pinColor.shadow}`,
        border: `1px solid ${pinColor.border}`,
      }}
    >
      {/* Metallic specular highlight */}
      <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-white/70 filter blur-[0.4px]" />
      {/* Center pin depression */}
      <div className="w-[30%] h-[30%] rounded-full bg-white/30 shadow-inner" />
    </div>
  );
};

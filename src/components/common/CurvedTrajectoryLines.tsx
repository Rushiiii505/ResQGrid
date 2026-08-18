import React from 'react';
import { motion } from 'framer-motion';

export const CurvedTrajectoryLines: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <svg
        className="w-full h-full min-h-[3800px] opacity-35"
        viewBox="0 0 1440 3800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b6f014" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#9855ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b6f014" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Hero to WhyUs curve */}
        <path
          d="M 280 320 C 500 480, 850 350, 1100 520 C 1280 650, 1050 900, 750 920 C 450 940, 260 1100, 320 1300"
          stroke="url(#lineGrad1)"
          strokeWidth="1.75"
          strokeDasharray="6 8"
          className="animate-dash"
        />

        {/* WhyUs to Services looping trajectory */}
        <path
          d="M 320 1300 C 380 1500, 850 1450, 1120 1600 C 1300 1720, 1000 1900, 700 1950 C 400 2000, 200 2150, 350 2380"
          stroke="#00f0ff"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          className="animate-dash"
          opacity="0.8"
        />

        {/* Services to OurWork path */}
        <path
          d="M 350 2380 C 500 2600, 1150 2550, 1250 2800 C 1320 2980, 950 3150, 650 3250 C 350 3350, 450 3550, 720 3650"
          stroke="#b6f014"
          strokeWidth="1.75"
          strokeDasharray="6 8"
          className="animate-dash"
          opacity="0.9"
        />

        {/* Waypoint circles with rings */}
        <circle cx="280" cy="320" r="4" fill="#b6f014" filter="url(#glowFilter)" />
        <circle cx="1100" cy="520" r="3.5" fill="#00f0ff" />
        <circle cx="750" cy="920" r="4" fill="#9855ff" />
        <circle cx="1120" cy="1600" r="3.5" fill="#ff5b37" />
        <circle cx="700" cy="1950" r="4" fill="#b6f014" />
        <circle cx="1250" cy="2800" r="3.5" fill="#00f0ff" />
        <circle cx="650" cy="3250" r="4" fill="#b6f014" />
      </svg>

      {/* Floating Animated Pulses along the page */}
      <motion.div
        animate={{
          x: [280, 550, 850, 1100, 900, 750, 450, 320],
          y: [320, 440, 370, 520, 780, 920, 1050, 1300],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-3 h-3 rounded-full bg-[#b6f014] shadow-[0_0_12px_#b6f014] filter blur-[0.5px]"
      />

      <motion.div
        animate={{
          x: [320, 500, 900, 1120, 950, 700, 400, 350],
          y: [1300, 1450, 1480, 1600, 1850, 1950, 2100, 2380],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
          delay: 4,
        }}
        className="absolute w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] filter blur-[0.5px]"
      />
    </div>
  );
};

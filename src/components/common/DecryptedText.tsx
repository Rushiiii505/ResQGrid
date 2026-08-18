import React, { useState, useEffect, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'both';
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  characters = '0123456789ABCDEF#@!%&/<>~*+',
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-[#b6f014]/70 font-mono',
  animateOn = 'view',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  const scramble = () => {
    let iteration = 0;
    const length = text.length;
    setIsScrambling(true);

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let revealed = false;
            if (sequential) {
              if (revealDirection === 'start') {
                revealed = index < (iteration / maxIterations) * length;
              } else if (revealDirection === 'end') {
                revealed = index >= length - (iteration / maxIterations) * length;
              } else {
                const mid = length / 2;
                const progress = (iteration / maxIterations) * mid;
                revealed = Math.abs(index - mid) <= progress;
              }
            } else {
              revealed = iteration >= maxIterations;
            }

            if (revealed) {
              return text[index];
            }

            const randIndex = Math.floor(Math.random() * characters.length);
            return characters[randIndex];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (animateOn === 'view' || animateOn === 'both') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              scramble();
            }
          });
        },
        { threshold: 0.15 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [text]);

  const handleMouseEnter = () => {
    if ((animateOn === 'hover' || animateOn === 'both') && !isScrambling) {
      scramble();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block transition-colors duration-150 ${parentClassName}`}
    >
      <span className={isScrambling ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
};

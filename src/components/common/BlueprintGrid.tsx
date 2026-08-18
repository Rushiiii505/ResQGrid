import React, { useEffect, useRef } from 'react';

export const BlueprintGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const gridSize = 48;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw subtle grid intersections and coordinate crosshairs
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          const dist = Math.hypot(x - mx, y - my);
          const maxDist = 180;

          if (dist < maxDist) {
            const intensity = 1 - dist / maxDist;
            // Draw glowing crosshair near cursor
            ctx.strokeStyle = `rgba(182, 240, 20, ${intensity * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 4, y);
            ctx.lineTo(x + 4, y);
            ctx.moveTo(x, y - 4);
            ctx.lineTo(x, y + 4);
            ctx.stroke();

            // Glow dot
            ctx.fillStyle = `rgba(0, 240, 255, ${intensity * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else if ((i % 4 === 0) && (j % 4 === 0)) {
            // Subtle persistent blueprint mark
            ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw subtle cursor radar wave
      if (mx > 0 && my > 0) {
        const radius = (Math.sin(t * 1.5) * 0.5 + 0.5) * 80 + 30;
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 160);
        grad.addColorStop(0, 'rgba(182, 240, 20, 0.08)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.03)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 160, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(182, 240, 20, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

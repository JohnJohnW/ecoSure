import { useEffect, useRef } from 'react';

function useReduced() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Ripples({ intensity = 0.15 }) {
  const canvasRef = useRef(null);
  const reduced = useReduced();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let hidden = false;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      const { innerWidth:w=800, innerHeight:h=600 } = window;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    resize();
    window.addEventListener('resize', resize);
    const onVis = () => { hidden = document.hidden; if (!hidden) loop(); };
    document.addEventListener('visibilitychange', onVis);

    const waves = Array.from({ length: 4 }).map((_, i) => ({
      r: 50 + i * 120,
      a: Math.random() * Math.PI * 2,
      s: 0.002 + Math.random() * 0.003
    }));

    function loop() {
      if (hidden) return;
      const w = canvas.width / DPR, h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = intensity;
      for (const wave of waves) {
        wave.a += wave.s;
        const x = w/2 + Math.cos(wave.a) * 80;
        const y = h/2 + Math.sin(wave.a*0.7) * 60;
        const grad = ctx.createRadialGradient(x, y, wave.r*0.4, x, y, wave.r);
        grad.addColorStop(0, 'rgba(13,148,136,0.35)');
        grad.addColorStop(1, 'rgba(13,148,136,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, wave.r, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVis); };
  }, [intensity, reduced]);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} aria-hidden="true" />;
}


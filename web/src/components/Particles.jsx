import { useEffect, useRef } from 'react';

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Particles({ count = 12, biome = 'Forest' }) {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return; // respect reduced motion
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      const { innerWidth:w=800, innerHeight:h=600 } = window;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const items = Array.from({ length: count }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 6 + Math.random() * 10,
      s: 0.3 + Math.random() * 0.6,
      a: Math.random() * Math.PI * 2
    }));

    const attrBiome = typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-biome') || 'Forest') : 'Forest';
    const mode = biome || attrBiome || 'Forest';

    function drawForest(w, h){
      for (const leaf of items) {
        leaf.a += 0.002 + leaf.s * 0.003;
        leaf.y += leaf.s;
        leaf.x += Math.cos(leaf.a) * 0.3;
        if (leaf.y - leaf.r > h) { leaf.y = -leaf.r; leaf.x = Math.random() * w; }
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(Math.cos(leaf.a) * 0.2);
        const grd = ctx.createLinearGradient(-leaf.r, -leaf.r, leaf.r, leaf.r);
        grd.addColorStop(0, 'rgba(16,185,129,0.18)');
        grd.addColorStop(1, 'rgba(13,148,136,0.18)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.r);
        ctx.quadraticCurveTo(leaf.r, 0, 0, leaf.r);
        ctx.quadraticCurveTo(-leaf.r, 0, 0, -leaf.r);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawCoastal(w, h){
      for (const bub of items) {
        // distinct round bubbles rising
        bub.a += 0.01;
        bub.y -= bub.s * 1.5;
        bub.x += Math.sin(bub.a) * 0.35;
        if (bub.y + bub.r < 0) { bub.y = h + bub.r; bub.x = Math.random() * w; }
        const grd = ctx.createRadialGradient(bub.x, bub.y, 0, bub.x, bub.y, bub.r);
        grd.addColorStop(0, 'rgba(34,211,238,0.35)');
        grd.addColorStop(1, 'rgba(34,211,238,0.0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(bub.x, bub.y, bub.r, 0, Math.PI*2); ctx.fill();
        // subtle highlight
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.arc(bub.x - bub.r*0.3, bub.y - bub.r*0.3, bub.r*0.3, 0, Math.PI*2); ctx.fill();
      }
    }

    function drawRiver(w, h){
      ctx.save();
      ctx.lineCap = 'round';
      for (const drop of items) {
        // long vertical streaks, clearly not leaves
        const len = drop.r * 2.2; // streak length
        drop.y += drop.s * 2.0;   // faster fall
        drop.x += Math.sin(drop.a) * 0.15; // slight sway
        drop.a += 0.01;
        if (drop.y - len > h) { drop.y = -len; drop.x = Math.random() * w; }

        const x = drop.x, y1 = drop.y - len, y2 = drop.y + 1;
        const grad = ctx.createLinearGradient(x, y1, x, y2);
        grad.addColorStop(0, 'rgba(56,189,248,0.28)');
        grad.addColorStop(1, 'rgba(56,189,248,0.05)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const { innerWidth: w, innerHeight: h } = window;
      ctx.clearRect(0, 0, w, h);
      if (mode === 'Coastal') drawCoastal(w, h);
      else if (mode === 'River') drawRiver(w, h);
      else drawForest(w, h);
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      // clear on unmount/switch to avoid ghost frames
      const { innerWidth: w, innerHeight: h } = window;
      ctx.clearRect(0, 0, w, h);
    };
  }, [count, reduced, biome]);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} aria-hidden="true" />;
}


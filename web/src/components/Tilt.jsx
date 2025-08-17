import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function usePrefersReducedMotion(){
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const Tilt = forwardRef(function Tilt(
  {
    children,
    className = "",
    as: Tag = 'div',
    max = 6,
    perspective = 800,
    scale = 1.0,
    spring = { duration: 0.25, ease: 'easeOut' },
    disabled = false,
    ...rest
  },
  ref
){
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  const reduced = usePrefersReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  const onMove = useCallback((e) => {
    if (disabled || reduced) return;
    const t = e.currentTarget;
    const rect = t.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;   // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;  // -0.5..0.5
    isHoveringRef.current = true;
    setTilt({ x: -(dy * max), y: dx * max });
  }, [disabled, reduced, max]);

  const onLeave = useCallback(() => {
    isHoveringRef.current = false;
    setTilt({ x: 0, y: 0 });
  }, []);

  const style = reduced || disabled
    ? undefined
    : { rotateX: tilt.x, rotateY: tilt.y, transformPerspective: perspective, scale: isHoveringRef.current ? scale : 1 };

  return (
    <MotionTag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      transition={spring}
      {...rest}
    >
      {children}
    </MotionTag>
  );
});

export default Tilt;



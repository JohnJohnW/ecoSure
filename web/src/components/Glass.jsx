import { forwardRef, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";

const Glass = forwardRef(function Glass({ children, className = "", as: Tag = 'div', ...rest }, ref) {
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;   // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;  // -0.5..0.5
    const max = 2.5; // degrees
    setTilt({ x: -(dy * max), y: dx * max });
  }, []);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);
  return (
    <MotionTag
      ref={ref}
      className={`glass ${className}`}
      initial={{ y: 8, opacity: 0, filter: 'saturate(0.8)' }}
      animate={{ y: 0, opacity: 1, filter: 'saturate(1)' }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      style={{ rotateX: tilt.x, rotateY: tilt.y, transformPerspective: 800 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
});

export default Glass;


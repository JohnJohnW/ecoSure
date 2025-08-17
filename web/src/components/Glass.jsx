import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import Tilt from "./Tilt.jsx";

const Glass = forwardRef(function Glass({ children, className = "", as: Tag = 'div', ...rest }, ref) {
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  return (
    <Tilt as={MotionTag} ref={ref} className={`glass ${className}`} max={3} scale={1.005} transition={{ duration: 0.4, ease: 'easeOut' }} {...rest}>
      {children}
    </Tilt>
  );
});

export default Glass;


import { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const Float = forwardRef(function Float({
  children,
  className = '',
  as: Tag = 'div',
  amplitude = 4,
  duration = 3,
  delay = 0,
  ...rest
}, ref){
  const MotionTag = useMemo(() => motion(Tag), [Tag]);
  return (
    <MotionTag
      ref={ref}
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
});

export default Float;



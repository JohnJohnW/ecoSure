import { useEffect } from 'react';

export default function AutoStagger({ selector = '*', delayStep = 60 }){
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((n, i) => {
      n.style.viewTransitionName = 'stagger-' + i; // harmless in modern browsers
      n.style.animationDelay = (i * delayStep) + 'ms';
    });
    return () => { nodes.forEach(n => { n.style.animationDelay = ''; n.style.viewTransitionName = ''; }); };
  }, [selector, delayStep]);
  return null;
}



import React, {useEffect, useRef, useState} from 'react';
import './motion.css';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useInViewport(ref) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

// Only editorial homepage content reveals. Forms and operational data stay still.
export default function ScenicMotion({children}) {
  const root = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const nodes = [...root.current.querySelectorAll(
      '.intro > .eyebrow, .intro > h2, .intro > p, .pillars > article, .section-top, .destinations > article, .modes > .eyebrow, .modes > h2, .modeGrid > article, .banner > *'
    )];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.reveal = 'visible';
        observer.unobserve(entry.target);
      }
    }, {threshold: 0.08});
    for (const node of nodes) {
      // Never hide something already on screen, above the viewport, or linked by a hash.
      if (node.getBoundingClientRect().top < innerHeight) continue;
      node.dataset.reveal = 'waiting';
      const siblings = [...node.parentElement.children];
      node.style.transitionDelay = `${(siblings.indexOf(node) % 3) * 50}ms`;
      observer.observe(node);
    }
    const revealFocus = event => {
      const node = event.target.closest('[data-reveal]');
      if (node) {
        node.removeAttribute('data-reveal');
        observer.unobserve(node);
      }
    };
    root.current.addEventListener('focusin', revealFocus);
    const element = root.current;
    return () => {
      observer.disconnect();
      element.removeEventListener('focusin', revealFocus);
      nodes.forEach(node => {node.removeAttribute('data-reveal'); node.style.transitionDelay = '';});
    };
  }, [reduced]);
  return <div ref={root} className="scenic-home">{children}</div>;
}

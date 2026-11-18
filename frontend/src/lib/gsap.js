import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

document.fonts.ready.then(() => ScrollTrigger.refresh());

export const MEDIA = {
  motionOk: '(prefers-reduced-motion: no-preference)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 992px)',
};

export const MOTION = {
  duration: { fast: 0.4, base: 0.8, slow: 1.2 },
  ease: { out: 'power3.out', inOut: 'power2.inOut', back: 'back.out(1.7)' },
  stagger: { words: 0.08, tiles: 0.12, chars: 0.03, handles: 0.08 },
  dimmedOpacity: 0.45,
};

export { gsap, ScrollTrigger, useGSAP };

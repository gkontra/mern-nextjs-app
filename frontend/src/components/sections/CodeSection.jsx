import { useRef } from 'react';
import { gsap, MEDIA, MOTION, useGSAP } from '../../lib/gsap';
import TextSplit from '../ui/TextSplit';

const HEADLINE_LINES = ['Und am Ende: React.'];

const DEPTHS = ['far', 'mid', 'near'];

const DEPTH_TRAVEL = {
  desktop: { far: 8, mid: 20, near: 40 },
  mobile: { far: 5, mid: 12 },
};

const NEAR_DRIFT = 40;

const CODE_FRAGMENTS = [
  { depth: 'far', code: "document.querySelector('#app');" },
  { depth: 'far', code: 'export default App;' },
  { depth: 'far', code: "import { useState } from 'react';" },
  { depth: 'far', code: 'const modules = await loadModules();' },
  { depth: 'mid', code: 'const [count, setCount] = useState(0);' },
  { depth: 'mid', code: 'type Module = {\n  moduleId: number;\n  title: string;\n};' },
  { depth: 'mid', code: "const response = await fetch('/api/modules');" },
  { depth: 'mid', code: "button.addEventListener('click', onClick);" },
  { depth: 'near', code: '<ModuleCard module={module} />' },
  { depth: 'near', code: 'useEffect(() => {\n  loadModules();\n}, []);' },
  { depth: 'near', code: 'const total = prices.reduce(\n  (sum, price) => sum + price, 0);' },
  { depth: 'near', code: 'npm run dev' },
];

const CodeSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, desktop: MEDIA.desktop }, (context) => {
        const { motionOk, desktop } = context.conditions;

        if (!motionOk) {
          return;
        }

        gsap.from('.char', {
          yPercent: 100,
          autoAlpha: 0,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.out,
          stagger: MOTION.stagger.chars,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });

        const layers = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });

        Object.entries(desktop ? DEPTH_TRAVEL.desktop : DEPTH_TRAVEL.mobile).forEach(([depth, travel]) => {
          layers.fromTo(`.code-layer[data-depth="${depth}"]`, { yPercent: travel }, { yPercent: -travel }, 0);
        });

        if (desktop) {
          layers.fromTo('.code-layer[data-depth="near"]', { x: NEAR_DRIFT }, { x: -NEAR_DRIFT }, 0);
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="m-code-section code-section" aria-labelledby="code-title">
      <div className="code-background" aria-hidden="true">
        {DEPTHS.map((depth) => (
          <div className="code-layer" data-depth={depth} key={depth}>
            {CODE_FRAGMENTS.map((fragment, index) =>
              fragment.depth === depth ? (
                <pre className={`fragment fragment-${index + 1}`} key={fragment.code}>
                  {fragment.code}
                </pre>
              ) : null,
            )}
          </div>
        ))}
      </div>
      <div className="container">
        <h2 id="code-title" className="headline">
          <TextSplit lines={HEADLINE_LINES} by="char" />
        </h2>
      </div>
    </section>
  );
};

export default CodeSection;

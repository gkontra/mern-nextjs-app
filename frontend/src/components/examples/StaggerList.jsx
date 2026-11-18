import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ITEMS = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React'];

const StaggerList = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.item', {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.list',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            markers,
          },
        });

        // gsap.from(document.querySelectorAll('.item')[0], { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out' });
        // gsap.from(document.querySelectorAll('.item')[1], {
        //   y: 40,
        //   opacity: 0,
        //   duration: 0.6,
        //   ease: 'power3.out',
        //   delay: 0.1,
        // });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-stagger-list example-stagger-list">
      <ul className="list">
        {ITEMS.map((item) => (
          <li className="item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaggerList;

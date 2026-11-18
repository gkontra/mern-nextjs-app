import { useGSAP, gsap } from '../../lib/gsap';
import { useRef } from 'react';

const TweenOnMount = () => {
  // const { } = props;

  const containerRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(() => {
    tweenRef.current = gsap.from('.box', { y: 80, autoAlpha: 0, duration: 0.8, ease: 'power3.out' });
    // tweenRef.current = gsap.fromTo(
    //   '.box',
    //   { x: -500, duration: 0.8, ease: 'power3.out' },
    //   { x: 500, duration: 0.8, ease: 'power3.out' },
    // );
  }, {});

  const handleClick = () => {
    tweenRef.current?.restart();
  };

  return (
    <div ref={containerRef} className="m-example-tween-on-mount example-tween-on-mount">
      <p className="box">Hallo GSAP</p>
      <button type="button" className="replay" onClick={handleClick}>
        Nochmal abspielen
      </button>
    </div>
  );
};
export default TweenOnMount;

import { useRef } from 'react';
import { gsap, MEDIA, MOTION, useGSAP } from '../../lib/gsap';
import { isTitleOnly, splitSlides, stripFrontMatter } from '../../lib/markdownSource';
import MarkdownContent from './MarkdownContent';

const SLIDE_LEVELS = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4 };

const AgendaSlides = (props) => {
  const { source } = props;
  const containerRef = useRef(null);
  const slides = splitSlides(stripFrontMatter(source));
  const chapterNumbers = slides.reduce((numbers, slide) => {
    numbers.push(isTitleOnly(slide) ? numbers.filter(Boolean).length + 1 : 0);
    return numbers;
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOk, () => {
        gsap.utils.toArray('.slide', containerRef.current).forEach((slide) => {
          const timeline = gsap
            .timeline({
              defaults: { duration: MOTION.duration.fast, ease: MOTION.ease.out, clearProps: 'opacity,transform' },
              scrollTrigger: { trigger: slide, start: 'top 85%', toggleActions: 'play none none none' },
            })
            .from(slide, { opacity: 0, y: 32 })
            .from(
              slide.querySelectorAll('.word-inner'),
              { opacity: 0, yPercent: 100, stagger: MOTION.stagger.words },
              '<0.1',
            );
          const items = slide.querySelectorAll('li');

          if (items.length > 0) {
            timeline.from(items, { opacity: 0, x: -16, stagger: MOTION.stagger.items }, '-=0.2');
          }
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-agenda-slides agenda-slides">
      {slides.map((slide, index) => {
        const chapterNumber = chapterNumbers[index];

        return (
          <section className={chapterNumber ? 'slide is-chapter' : 'slide'} key={index}>
            {chapterNumber > 0 && <p className="chapter-kicker">Kapitel {chapterNumber}</p>}
            <MarkdownContent source={slide} headingLevels={SLIDE_LEVELS} splitHeadings />
          </section>
        );
      })}
    </div>
  );
};

export default AgendaSlides;

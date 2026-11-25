import { isTitleOnly, splitSlides, stripFrontMatter } from '../../lib/markdownSource';
import MarkdownContent from './MarkdownContent';

const SLIDE_LEVELS = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4 };

const AgendaSlides = (props) => {
  const { source } = props;
  const slides = splitSlides(stripFrontMatter(source));
  const chapterNumbers = slides.reduce((numbers, slide) => {
    numbers.push(isTitleOnly(slide) ? numbers.filter(Boolean).length + 1 : 0);
    return numbers;
  }, []);

  return (
    <div className="m-agenda-slides agenda-slides">
      {slides.map((slide, index) => {
        const chapterNumber = chapterNumbers[index];

        return (
          <section className={chapterNumber ? 'slide is-chapter' : 'slide'} key={index}>
            {chapterNumber > 0 && <p className="chapter-kicker">Kapitel {chapterNumber}</p>}
            <MarkdownContent source={slide} headingLevels={SLIDE_LEVELS} />
          </section>
        );
      })}
    </div>
  );
};

export default AgendaSlides;

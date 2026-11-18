import { useState, useSyncExternalStore } from 'react';
import TweenOnMount from '../components/examples/TweenOnMount';
import ReducedMotion from '../components/examples/ReducedMotion';
import ToggleActions from '../components/examples/ToggleActions';
import ScrubProgress from '../components/examples/ScrubProgress';
import ScrubTimeline from '../components/examples/ScrubTimeline';
import StaggerList from '../components/examples/StaggerList';

const EXAMPLES = [
  {
    number: '01',
    title: 'Tween beim Laden',
    text: 'gsap.from() animiert die Box einmal beim Laden der Seite – ohne ScrollTrigger. Der Button spielt sie erneut ab.',
    file: 'TweenOnMount.jsx',
    Example: TweenOnMount,
  },
  {
    number: '02',
    title: 'Reduced Motion + erster ScrollTrigger',
    text: 'Die Box fährt einmal von links herein, sobald sie 60 % der Fensterhöhe erreicht – aber nur, wenn ‚Bewegung reduzieren‘ aus ist.',
    file: 'ReducedMotion.jsx',
    Example: ReducedMotion,
  },
  {
    number: '03',
    title: 'toggleActions',
    text: 'Die Box fährt von rechts herein und beim Zurückscrollen wieder hinaus.',
    file: 'ToggleActions.jsx',
    Example: ToggleActions,
  },
  {
    number: '04',
    title: 'scrub mit Fortschrittsbalken',
    text: 'Der Balken füllt sich genau so weit, wie du durch diesen Abschnitt gescrollt hast.',
    file: 'ScrubProgress.jsx',
    Example: ScrubProgress,
  },
  {
    number: '05',
    title: 'Timeline mit scrub',
    text: 'Eine Timeline lässt drei Boxen nacheinander erscheinen; die dritte startet per Positions-Parameter früher.',
    file: 'ScrubTimeline.jsx',
    Example: ScrubTimeline,
  },
  {
    number: '06',
    title: 'stagger',
    text: 'Fünf Listeneinträge erscheinen mit 0,1 Sekunden Abstand nacheinander.',
    file: 'StaggerList.jsx',
    Example: StaggerList,
  },
];

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeToReduceMotion = (onChange) => {
  const mediaQuery = window.matchMedia(REDUCE_MOTION_QUERY);

  mediaQuery.addEventListener('change', onChange);

  return () => mediaQuery.removeEventListener('change', onChange);
};

const getReduceMotion = () => window.matchMedia(REDUCE_MOTION_QUERY).matches;

const ExamplesPage = () => {
  const [showMarkers, setShowMarkers] = useState(true);
  const reduceMotion = useSyncExternalStore(subscribeToReduceMotion, getReduceMotion);

  return (
    <div className="page-examples">
      <div className="container">
        <h1 className="page-title">Animations-Beispiele</h1>
        <p className="intro">
          Jedes Beispiel zeigt genau eine Idee aus GSAP und ScrollTrigger. Scrolle langsam nach unten und wieder nach
          oben und beobachte, was passiert.
        </p>
        <p className="motion-status" role="status">
          Bewegung reduzieren: <strong>{reduceMotion ? 'an' : 'aus'}</strong>
        </p>
        <p className="motion-hint">
          Steht hier „an“, bleiben alle Beispiele ab 02 absichtlich still. Umschalten kannst du unter macOS in
          Bedienungshilfen → Anzeige → Bewegung reduzieren oder in den Chrome-DevTools unter Rendering →
          prefers-reduced-motion.
        </p>
        <div className="form-check">
          <input
            id="examples-markers"
            className="form-check-input"
            type="checkbox"
            checked={showMarkers}
            onChange={(event) => setShowMarkers(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="examples-markers">
            Marker anzeigen
          </label>
        </div>
        <nav className="toc" aria-label="Beispiele">
          <ol>
            {EXAMPLES.map((example) => (
              <li key={example.number}>
                <a href={`#example-${example.number}`}>
                  Beispiel {example.number} – {example.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div key={showMarkers ? 'markers' : 'plain'}>
        {EXAMPLES.map(({ number, title, text, file, Example }) => (
          <section
            className="example"
            id={`example-${number}`}
            aria-labelledby={`example-${number}-title`}
            key={number}>
            <div className="container">
              <h2 id={`example-${number}-title`} className="example-title">
                Beispiel {number} – {title}
              </h2>
              <p className="example-text">{text}</p>
              <p className="example-file">
                <code>src/components/examples/{file}</code>
              </p>
            </div>
            <Example markers={showMarkers} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPage;

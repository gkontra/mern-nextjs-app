import { useState } from 'react';
import TweenOnMount from '../components/examples/TweenOnMount';

const EXAMPLES = [
  {
    number: '01',
    title: 'Tween beim Laden',
    text: 'gsap.from() animiert die Box einmal beim Laden der Seite – ohne ScrollTrigger. Der Button spielt sie erneut ab.',
    file: 'TweenOnMount.jsx',
    Example: TweenOnMount,
  },
];

const ExamplesPage = () => {
  const [showMarkers, setShowMarkers] = useState(false);

  return (
    <div className="page-examples">
      <div className="container">
        <h1 className="page-title">Animations-Beispiele</h1>
        <p className="intro">
          Jedes Beispiel zeigt genau eine Idee aus GSAP und ScrollTrigger. Scrolle langsam nach unten und wieder nach
          oben und beobachte, was passiert.
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

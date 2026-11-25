import MarkdownContent from '../components/content/MarkdownContent';
import linksSource from '../content/linksammlung.md?raw';
import { stripLeadingTitle } from '../lib/stripLeadingTitle';

// ?raw - info für vite. Inhalt soll als String eingebunden werden und nicht über ein Plugin oder von Vite geparsed werden.
const ContentPage = () => {
  return (
    <div className="page-content page-content-links">
      <title>Linksammlung · JS-Kurs</title>
      <div className="container">
        <header className="content-header">
          <h1 className="content-title">Linksammlung</h1>
        </header>
        <MarkdownContent source={stripLeadingTitle(linksSource)} />
      </div>
    </div>
  );
};

export default ContentPage;

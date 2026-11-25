import AgendaSlides from '../components/content/AgendaSlides';
import MarkdownContent from '../components/content/MarkdownContent';
import agendaSource from '../content/agenda.md?raw';
import linksSource from '../content/linksammlung.md?raw';
import { stripLeadingTitle } from '../lib/markdownSource';

const DOCS = {
  agenda: {
    title: 'Agenda',
    intro: 'Alle Kurstage im Überblick – von den ersten Zeilen JavaScript bis React.',
  },
  links: {
    title: 'Linksammlung',
    intro: 'Nachschlagewerke, Werkzeuge und Lernspiele rund um den Kurs.',
  },
};

const ContentPage = (props) => {
  const { doc } = props;
  const { title, intro } = DOCS[doc];

  return (
    <div className={`page-content page-content-${doc}`}>
      <title>{`${title} · JS-Kurs`}</title>
      <div className="container">
        <header className="content-header">
          <h1 className="content-title">{title}</h1>
          <p className="content-intro">{intro}</p>
        </header>
        {doc === 'agenda' ? (
          <AgendaSlides source={agendaSource} />
        ) : (
          <MarkdownContent source={stripLeadingTitle(linksSource)} />
        )}
      </div>
    </div>
  );
};

export default ContentPage;

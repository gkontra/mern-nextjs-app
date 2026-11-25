import { useMemo } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import TextSplit from '../ui/TextSplit';

const SECTION_LEVELS = { 1: 2, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw, rehypeSanitize];
const EXTERNAL_URL = /^https?:\/\//;

const MarkdownLink = (props) => {
  const { href, children } = props;

  if (!EXTERNAL_URL.test(href ?? '')) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> (öffnet in neuem Tab)</span>
    </a>
  );
};

const MarkdownTable = (props) => {
  const { children } = props;

  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabelle">
      <table className="table table-striped">{children}</table>
    </div>
  );
};

const toComponents = (headingLevels, splitHeadings) => {
  const Heading = (props) => {
    const { node, children } = props;
    const Tag = `h${headingLevels[node.tagName.slice(1)]}`;

    return (
      <Tag className="content-heading">
        {splitHeadings && typeof children === 'string' ? <TextSplit lines={[children]} /> : children}
      </Tag>
    );
  };

  return {
    a: MarkdownLink,
    table: MarkdownTable,
    h1: Heading,
    h2: Heading,
    h3: Heading,
    h4: Heading,
    h5: Heading,
    h6: Heading,
  };
};

const MarkdownContent = (props) => {
  const { source, headingLevels = SECTION_LEVELS, splitHeadings = false } = props;
  const components = useMemo(() => toComponents(headingLevels, splitHeadings), [headingLevels, splitHeadings]);

  return (
    <div className="m-markdown-content markdown-content">
      <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS} components={components}>
        {source}
      </Markdown>
    </div>
  );
};

export default MarkdownContent;

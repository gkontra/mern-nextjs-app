import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const REMARK_PLUGINS = [remarkGfm];
// remarkGfm - http://gfn.de -> <a href="http://gfn.de">http://gfn.de</a>
const REHYPE_PLUGINS = [rehypeRaw, rehypeSanitize];
// rehypeRaw - versteht html in markdown

const MarkdownContent = (props) => {
  const { source } = props;

  return (
    <div className="m-markdown-content markdown-content">
      <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
        {source}
      </Markdown>
    </div>
  );
};

export default MarkdownContent;

// <Markdown>'[Gfn.de](https://gfn.de"]'</Markdown>
// <a href="https://gfn.de">Gfn.de</a>

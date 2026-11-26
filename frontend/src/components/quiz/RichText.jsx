const RichText = (props) => {
  const { html, as: Tag = 'span', className } = props;

  return (
    <Tag className={['m-rich-text', className].filter(Boolean).join(' ')} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default RichText;

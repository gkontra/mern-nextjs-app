const CommentCard = (props) => {
  const { author, text } = props;

  return (
    <figure className="m-comment-card comment-card">
      <figcaption className="comment-header">
        <span className="avatar" aria-hidden="true">
          {author.charAt(0)}
        </span>
        <span className="author">{author}</span>
      </figcaption>
      <blockquote className="comment-quote">
        <p>{text}</p>
      </blockquote>
    </figure>
  );
};

export default CommentCard;

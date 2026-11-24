const MultiplayerCursor = (props) => {
  const { name, color = 'amber' } = props;

  return (
    <div className={`m-multiplayer-cursor multiplayer-cursor is-${color}`} aria-hidden="true">
      <svg className="pointer" viewBox="0 0 24 24" width="24" height="24" focusable="false">
        <path d="M3 2 10.5 21l2.6-7.6L21 10.8Z" />
      </svg>
      <span className="name-tag">{name}</span>
    </div>
  );
};

export default MultiplayerCursor;

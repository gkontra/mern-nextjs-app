const SegmentToggle = (props) => {
  const { label, items, active } = props;

  return (
    <div className="m-segment-toggle segment-toggle" role="group" aria-label={label}>
      <span className="glow is-first" aria-hidden="true" />
      <span className="glow is-second" aria-hidden="true" />
      <span className="indicator" aria-hidden="true" />
      {items.map((item) => (
        <span
          className={`segment segment-${item.id}`}
          key={item.id}
          style={{ '--logo-size': item.logoSize }}
          aria-current={item.id === active ? 'true' : undefined}>
          <img className="logo" src={item.logo} alt={item.name} width={item.width} height={item.height} />
        </span>
      ))}
    </div>
  );
};

export default SegmentToggle;

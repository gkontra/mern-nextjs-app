const EDGES = ['top', 'right', 'bottom', 'left'];
const HANDLES = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

const SelectionFrame = (props) => {
  const { children } = props;

  return (
    <div className="m-selection-frame selection-frame">
      <span className="frame-lines" aria-hidden="true">
        {EDGES.map((edge) => (
          <span className={`edge edge-${edge}`} key={edge} />
        ))}
        {HANDLES.map((handle) => (
          <span className={`handle handle-${handle}`} key={handle} />
        ))}
      </span>
      <div className="frame-content">{children}</div>
    </div>
  );
};

export default SelectionFrame;

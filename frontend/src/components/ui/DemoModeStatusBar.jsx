import { IS_MOCK_API } from '../../lib/isMockApi';

const DemoModeStatusBar = (props) => {
  // const { } = props;
  const css = {
    backgroundColor: '#ffff8e', //
    color: '#222',
    padding: '0.5rem 1rem 0rem',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    bottom: 0,
    position: 'fixed',
    zIndex: 99999,
  };

  if (IS_MOCK_API) {
    return (
      <div className="container-fluid" style={css}>
        <p>Demomodus aktiv</p>
      </div>
    );
  } else {
    return null;
  }
};
export default DemoModeStatusBar;

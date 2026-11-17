import LogoMain from '../logos/LogoMain';
import Slider from '../sliders/Slider';

const HeaderMain = () => {
  return (
    <header className="m-header-main header-main">
      <Slider
        label="Hintergrundbilder im Header"
        slides={['/img/slides/slide-01.jpg', '/img/slides/slide-02.jpg', '/img/slides/slide-03.jpg']}
      />
      <div className="content-box">
        <LogoMain />
      </div>
    </header>
  );
};

export default HeaderMain;

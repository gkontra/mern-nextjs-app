import BrowserSection from '../components/sections/BrowserSection';
import CodeSection from '../components/sections/CodeSection';
import CtaSection from '../components/sections/CtaSection';
import HeroSection from '../components/sections/HeroSection';
import StackSwitchSection from '../components/sections/StackSwitchSection';

const HomePage = () => {
  // const { } = props;

  return (
    <div className="page-home">
      <HeroSection />
      <BrowserSection />
      <StackSwitchSection />
      <CodeSection />
      <CtaSection />
    </div>
  );
};
export default HomePage;

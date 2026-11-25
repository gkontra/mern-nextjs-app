import BrowserSection from '../components/sections/BrowserSection';
import CodeSection from '../components/sections/CodeSection';
import CtaSection from '../components/sections/CtaSection';
import HeroSection from '../components/sections/HeroSection';
import ModulesCollageSection from '../components/sections/ModulesCollageSection';
import ModulesSection from '../components/sections/ModulesSection';
import StackSwitchSection from '../components/sections/StackSwitchSection';

const HomePage = () => {
  return (
    <div className="page-home">
      <HeroSection />
      <ModulesCollageSection />
      <BrowserSection />
      <StackSwitchSection />
      <CodeSection />
      <CtaSection />
      <ModulesSection />
    </div>
  );
};

export default HomePage;

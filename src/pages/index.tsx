import GetInTourchCard from '@/components/Card/GetInTouchCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BuildBySection from '@/layouts/home/BuildBySection';
import FaqsSection from '@/layouts/home/FaqsSection';
import Hero from '@/layouts/home/Hero';
import JoinJobaSection from '@/layouts/home/JoinJobaSection';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main meta={<Meta title="JOBA" description="JOBA" />}>
      <Header />
      <div className="bg-yellow-50">
        <Hero />
        <div className="h-96 w-full bg-hero-banner-mob bg-cover bg-top bg-no-repeat md:h-[394px] md:bg-hero-banner" />
        <BuildBySection />
        <div className="h-[425px] w-full bg-banner-2-mob bg-cover bg-top bg-no-repeat md:h-[584px] md:bg-banner-2" />
        <JoinJobaSection />
        <div className="bg-white pb-4 pt-6 md:py-24">
          <FaqsSection />
          <GetInTourchCard />
        </div>
      </div>
      <Footer />
    </Main>
  );
};

export default Index;

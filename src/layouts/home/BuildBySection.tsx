import React from 'react';

import Container from '../../components/Container';

const BuildBySection = () => {
  return (
    <Container className="py-14 lg:pt-[92px]">
      <React.Fragment>
        <div className="hidden border-t border-base-100 p-2 lg:block" />

        <div className="mb-4 flex  items-start justify-center gap-8 md:mb-0 lg:py-12">
          <div className="w-full space-y-8 md:space-y-10 lg:w-1/2">
            <h2 className="text-40px font-bold leading-[50px] tracking-tight text-primary-200 md:text-60px md:leading-120">
              Built by builders, for builders
            </h2>
            <p className="text-sm font-normal leading-[22px]  tracking-wide text-primary-200 md:max-w-[570px] md:text-xl">
              The demand for Web3 talent is rising faster than supply. Bitcoin
              and blockchain technology are helping us create a better world.
              Joba is creating a new standard for hiring to optimize talent
              acquisition & productivity in the Web3 era.
            </p>
          </div>
          <div className="hidden w-1/2 md:mt-2 lg:block">
            <img
              src="/assets/images/feature-banner-1.svg"
              alt="feature-banner-1"
            />
          </div>
        </div>
      </React.Fragment>
    </Container>
  );
};

export default BuildBySection;

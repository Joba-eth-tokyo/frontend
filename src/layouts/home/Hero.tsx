import React from 'react';

import Button from '@/components/Button';

import Container from '../../components/Container';

const Hero = () => {
  return (
    <Container>
      <div className="pb-10 pt-8  md:pb-[86px] md:pt-[76px]">
        <p className="mb-2 text-sm font-semibold leading-150 tracking-wider text-primary-200 md:text-base">
          GLOBALIZATION 3.0
        </p>
        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row xl:gap-12">
          <div className="w-full md:max-w-xl xl:max-w-2xl">
            <h1 className="text-5xl font-bold leading-120 tracking-tight text-primary-200 md:text-6xl">
              Work, earn <br className="sm:hidden" /> and invest in Web 3.0
            </h1>
          </div>

          <div className="flex-1 md:mt-4">
            <p className="text-sm font-normal leading-8 tracking-wide text-primary-200 md:text-xl">
              Discover open jobs in multiple blockchain{' '}
              <br className="hidden xl:block" />
              ecosystems + earn bounties{' '}
              <br className="hidden sm:block lg:hidden" /> for referrals &
              getting <br className="hidden xl:block" />
              hired - over $1,000,000+ in crypto bounties have{' '}
              <br className="hidden xl:block" />
              been set to date.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-start gap-3.5 sm:flex-row md:gap-2.5">
          <input
            className="box-border h-12 w-full rounded-lg border border-gray-25 bg-white px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-200 focus:outline-none focus:ring-0 sm:max-w-xs sm:px-6 sm:py-5 md:h-[65px] md:rounded-none md:text-base"
            placeholder="Enter email address"
          />

          <Button
            className="h-12 w-full sm:w-auto md:h-[65px]"
            buttonType="primary"
          >
            Join the waitlist
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Hero;

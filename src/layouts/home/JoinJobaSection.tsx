import React from 'react';

import NetworkCard from '@/components/Card/NetworkCard';
import { membersList } from '@/utils/constant';

import Container from '../../components/Container';

const JoinJobaSection = () => {
  return (
    <Container className="pb-10 pt-12 md:pb-[92px] md:pt-20">
      <React.Fragment>
        <h2 className="text-40px font-bold leading-120 tracking-tight text-primary-200 md:text-60px">
          Join the Joba network
        </h2>
        <h2 className="max-w-2xl bg-button-gradient bg-clip-text text-40px font-bold leading-120 tracking-tight text-transparent md:text-60px">
          Earn and invest in Web3
        </h2>

        <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-2 md:gap-3 md:pt-12">
          <NetworkCard
            title="I want to earn"
            description="Join a thriving community of highly skilled tech
                    talents. Explore roles for your skills and be part of
                    exciting projects"
            linkLabel="I’m a talent looking for roles"
            href="/"
            members={membersList}
            backgroundColor="bg-white"
          />

          <NetworkCard
            title="I want to invest"
            description="Get access to community of highly skilled tech
                  talents. Explore the best talents for your projects
                  and get matched."
            linkLabel="I am looking to hire"
            href="/"
            backgroundColor="bg-blue-50"
          />
        </div>
      </React.Fragment>
    </Container>
  );
};

export default JoinJobaSection;

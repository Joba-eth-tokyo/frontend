import React from 'react';

import Collapse from '@/components/Collapse';
import { faqsList } from '@/utils/constant';

import Container from '../../components/Container';

const FaqsSection = () => {
  return (
    <Container className="max-w-3xl">
      <React.Fragment>
        <h2 className="text-left text-2xl font-medium leading-[44px] tracking-tight text-primary-200 sm:text-center md:text-4xl md:leading-120">
          Frequently asked questions
        </h2>
        <p className="text-left text-sm font-normal leading-8 tracking-wide text-base-300 sm:text-center md:mt-5 md:text-xl">
          Everything you need to know about Joba
        </p>

        <div className="py-14">
          {Number(faqsList?.length) > 0 &&
            faqsList.map((faq) => (
              <Collapse
                id={faq.id}
                key={faq.id}
                title={faq.question}
                description={faq.answer}
              />
            ))}
        </div>
      </React.Fragment>
    </Container>
  );
};

export default FaqsSection;

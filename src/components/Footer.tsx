import React from 'react';

import Button from '@/components/Button';
import LogoLight from '@/components/Logo/LogoLight';

import Container from './Container';
import { DiscordIcon, TelegramIcon, TwitterIcon } from './icons';
import { RightArrow } from './icons/RightArrow';

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-primary-500 px-6 py-16 text-center text-sm">
      <Container className="max-w-3xl px-0 ">
        <h2 className="text-center text-4xl font-bold text-yellow-200 md:text-5xl md:leading-[67px]">
          Stay tuned for more updates
        </h2>
        <p className="mt-3 text-sm font-normal leading-8 tracking-wide text-white md:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          curabitur ut ut urna. Integer sollicitudin mattis ac gravida vel
          egestas gravida diam.
        </p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row md:gap-4">
          <input
            className="h-12  w-full rounded-lg border border-gray-25 bg-white px-6 py-3 text-sm text-gray-200 placeholder:text-gray-200 focus:outline-none focus:ring-0 sm:max-w-[491px] sm:px-8 sm:py-4  md:text-base"
            placeholder="Enter your email address"
          />

          <Button
            size="small"
            className="h-12  w-full sm:w-auto md:h-14"
            buttonType="primary"
            rightSideIcon={
              <RightArrow className="stroke-white group-hover:stroke-yellow-200" />
            }
          >
            Subscribe
          </Button>
        </div>
      </Container>

      <Container className="mt-16 px-0 md:mt-24">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="hidden md:block">
            <LogoLight />
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-10">
            <div className="text-base text-white md:mb-0">Contact us:</div>
            <div className="flex items-center justify-center gap-7 md:gap-10">
              <a href="#" target="_blank">
                <TelegramIcon />
              </a>
              <a href="#" target="_blank">
                <DiscordIcon />
              </a>
              <a href="#" target="_blank">
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

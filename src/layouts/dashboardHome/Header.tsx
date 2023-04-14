import Link from 'next/link';
import React from 'react';

import Button from '@/components/Button';
// import BalanceInfo from "@/components/Card/BalanceInfo";
import { URLS } from '@/utils/urls';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Home' }) => {
  return (
    <div className="flex flex-col-reverse justify-between gap-10 xs:flex-row xs:items-center xs:gap-4 md:mb-7">
      <p className="text-base font-semibold leading-6 dark:text-yellow-200 md:text-2xl md:leading-9">
        {title}
      </p>
      <div className=" flex  items-center justify-between gap-4  xs:justify-end">
        {/* Not required right now.
         <BalanceInfo wrapperClassName="xs:hidden" /> 
         */}
        <Link href={URLS.CREATE_PROJECT} passHref>
          <Button
            className=" h-11 text-sm  sm:px-8 sm:py-3"
            buttonType="primary"
          >
            Create project
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;

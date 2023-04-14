import dynamic from 'next/dist/shared/lib/dynamic';
import React, { useState } from 'react';

import {
  HamburgerIcon,
  MessageQuestionIcon,
  NotificationIcon,
  SearchIcon,
} from '@/components/icons';
import Logo from '@/components/Logo';
import SideNavbar from '@/components/Navbars/SideNavbar';

const DarkModeSwitch = dynamic(() => import('@/components/DarkModeSwitch'), {
  ssr: false,
});

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className=" flex min-h-screen shrink-0 items-stretch overflow-hidden bg-brandWhite-100 dark:bg-primary-200">
      <SideNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 ">
        <div className="flex items-center justify-between gap-8 bg-primary-600 p-6 shadow-custom md:bg-white md:dark:bg-primary-200 lg:px-11">
          <Logo
            unqiueId="dashboard_black_logo"
            className="hidden dark:fill-white md:block lg:hidden"
          />
          <Logo
            unqiueId="dashboard_white_logo"
            className="fill-white md:hidden "
          />
          <div className="relative hidden max-w-lg flex-1 rounded-md bg-brandWhite-200 dark:bg-brandBlack-100 lg:block">
            <SearchIcon className="absolute left-4 top-2.5 stroke-base-100 dark:stroke-white" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full border-0 bg-transparent py-3.5 pl-14 pr-4 text-sm leading-4 outline-none placeholder:text-base-100 dark:placeholder:text-white"
            />
          </div>

          <div className="flex items-center justify-center gap-7 2xl:max-w-xs 2xl:flex-1">
            <DarkModeSwitch />
            <div className="hidden cursor-pointer md:block">
              <MessageQuestionIcon className=" stroke-white dark:stroke-white md:stroke-base-100" />
            </div>
            <div className="relative hidden md:block">
              <div className="absolute right-0.5 top-0 h-1.5 w-1.5 rounded-full bg-brandRed-100"></div>
              <NotificationIcon className="cursor-pointer stroke-white dark:stroke-white md:stroke-base-100" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <HamburgerIcon className="stroke-white dark:stroke-white md:stroke-base-100 lg:hidden" />
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 2xl:px-14 2xl:py-11">{children}</div>
      </div>
    </div>
  );
};

export default Dashboard;

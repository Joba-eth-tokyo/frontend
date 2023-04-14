import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

// import BalanceInfo from "@/components/Card/BalanceInfo";
import {
  BrifecaseIcon,
  CategoryIcon,
  CrossIcon,
  LogoutIcon,
  MessageIcon,
  SettingIcon,
  UsdIcon,
} from '@/components/icons';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/auth';
import { truncateString } from '@/utils/truncateString';
import { URLS } from '@/utils/urls';

import NavLink from './components/NavLink';

interface SideNavbarInnerNavListProps {
  setSidebarOpen: (data: boolean) => void;
  id: number; // Need unique id for logo. This component used twice
}

const sidebarLinks = [
  {
    title: 'Home',
    path: URLS.DASHBOARD_HOME,
    Icon: CategoryIcon,
  },
  {
    title: 'Earn',
    path: URLS.EARN,
    Icon: UsdIcon,
  },
  {
    title: 'Messages',
    path: URLS.MESSEGES,
    Icon: MessageIcon,
  },
  {
    title: 'Settings',
    path: URLS.SETTINGS,
    Icon: SettingIcon,
  },
  {
    title: 'Projects',
    path: URLS.PROJECTS,
    Icon: BrifecaseIcon,
  },
];

const SideNavbarInnerNavList: React.FunctionComponent<
  SideNavbarInnerNavListProps
> = ({ setSidebarOpen, id }) => {
  const { userData, handleLogout } = useAuth();
  return (
    <div className="flex max-h-screen flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 px-6 pb-10 pt-8">
        <Link href={URLS.DASHBOARD_HOME} className="hidden lg:block" passHref>
          <Logo unqiueId={`sidebar_logo_${id}`} className="fill-white" />
        </Link>
        <button
          type="button"
          className="ml-auto inline h-6 w-6 text-black hover:text-gray-900 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-pink-600 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <CrossIcon className="stroke-white" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between px-5">
        <div className="custom-scrollbar relative flex flex-1 flex-col overflow-auto">
          <nav className="absolute inset-0">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-brandBlack-100 px-5 py-3">
              <Image
                width={16}
                height={16}
                src="/assets/images/vector.svg"
                alt="vector"
              />

              <p className="text-xs font-semibold leading-5 text-yellow-300">
                {userData?.wallet_address
                  ? truncateString({
                      string: userData?.wallet_address,
                      afterDotsStringLength: 3,
                    })
                  : ''}
              </p>
            </div>

            {/*
              Not required right now.

            <BalanceInfo
              wrapperClassName="mb-10 hidden sm:flex"
              className="text-yellow-200"
              iconClassName="stroke-yellow-200"
            /> */}
            <div className="space-y-4">
              {sidebarLinks.map(({ title, path, Icon }) => (
                <NavLink
                  key={title}
                  title={title}
                  path={path}
                  Icon={({ className }: { className: string }) => (
                    <Icon className={className} />
                  )}
                />
              ))}
            </div>
          </nav>
        </div>

        <div className="shrink-0 py-4">
          <div
            className={
              'group flex cursor-pointer items-center gap-4 rounded-lg px-5 py-3 font-medium text-gray-50 transition-all  duration-300 ease-in-out hover:bg-brandBlack-100 hover:text-yellow-200'
            }
            onClick={() => {
              handleLogout();
            }}
          >
            <LogoutIcon
              className={
                'stroke-gray-50 transition-all  duration-300 ease-in-out group-hover:stroke-yellow-200'
              }
            />
            <p className="text-sm leading-4 text-inherit">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbarInnerNavList;

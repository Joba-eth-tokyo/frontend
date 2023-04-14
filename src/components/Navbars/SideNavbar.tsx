import { Transition } from '@headlessui/react';
import React from 'react';

import SideNavbarInnerNavList from './components/SideNavbarInnerNavList';

export interface SideNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (data: boolean) => void;
}

export default function SideNavbar({
  sidebarOpen,
  setSidebarOpen,
}: SideNavbarProps) {
  return (
    <>
      <div
        className={
          'hidden w-60 shrink-0 bg-primary-600 dark:bg-primary-500 lg:flex'
        }
      >
        <SideNavbarInnerNavList setSidebarOpen={setSidebarOpen} id={0} />
      </div>
      <div className="lg:hidden">
        <Transition.Root show={sidebarOpen} as={React.Fragment}>
          <Transition.Child
            as={React.Fragment}
            enter="transition linear duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition linear duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div
              className={
                'fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 bg-primary-600 focus:outline-none dark:bg-primary-500'
              }
            >
              <SideNavbarInnerNavList setSidebarOpen={setSidebarOpen} id={1} />
            </div>
          </Transition.Child>
        </Transition.Root>
      </div>
    </>
  );
}

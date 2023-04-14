import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

import { CrossIcon } from './icons';

export enum ModalVariant {
  SMALL = 'max-w-md',
  LARGE = 'max-w-lg',
  X_LARGE = 'max-w-2xl',
}

interface ModalWrapperProps {
  maskClosable?: boolean;
  children: React.ReactNode;
  showModal: boolean;
  setModal: (val: boolean) => void;
  variant?: ModalVariant;
  title?: string;
}
export default function ModalWrapper({
  maskClosable = true,
  children,
  showModal,
  setModal,
  variant = ModalVariant.SMALL,
  title,
}: ModalWrapperProps) {
  function handleOnClose(openValue: boolean) {
    if (maskClosable) {
      setModal(openValue);
    }
  }

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={(val) => handleOnClose(val)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-brandBlack-200/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={twMerge(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-brandBlack-100 dark:border dark:border-brandBlack-300 dark:shadow-2xl text-left align-middle shadow-xl transition-all',
                  variant
                )}
              >
                {title && (
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <Dialog.Title
                      className={
                        'text-xl font-semibold leading-7 text-primary-100 dark:text-yellow-200 md:text-2xl md:leading-9'
                      }
                    >
                      {title}
                    </Dialog.Title>
                    <div
                      className="cursor-pointer"
                      onClick={() => setModal(false)}
                    >
                      <CrossIcon className="w-6 stroke-gray-600 hover:stroke-brandBlack-100 dark:hover:stroke-brandGray-200 " />
                    </div>
                  </div>
                )}
                <div className="px-6 pb-6 md:px-8 md:pb-8">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useToast } from '@/context/Toast';
import { toastVariants } from '@/utils/constant';

import ToastMessage from './ToastMessage';

export type ToastContainerProps = {
  variant?: keyof typeof toastVariants;
};

const ToastContainer = ({ variant = 'topRight' }: ToastContainerProps) => {
  const Var = toastVariants[variant] || toastVariants.topRight;

  const { remove, data } = useToast();

  function handleRemove(id: string) {
    remove(id);
  }

  return (
    <div
      className={twMerge(
        Var.style,
        'fixed z-50 w-full md:max-w-sm p-4 md:p-4 max-h-screen overflow-hidden pointer-events-none'
      )}
    >
      <div className="pointer-events-none mr-8 w-full flex-1 flex-col justify-end">
        {data.map((toast) => {
          return (
            <div
              key={toast.id}
              className={twMerge(
                'flex py-1 w-full',
                'transform transition-all duration-300 pointer-events-auto',
                variant === 'topRight' ||
                  variant === 'topLeft' ||
                  variant === 'topMiddle'
                  ? 'animate-fade-in-down'
                  : 'animate-fade-in-up'
              )}
            >
              <ToastMessage
                id={toast.id}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                header={toast.header}
                // icon={toast.icon}
                onRemove={handleRemove}
                lifetime={toast.lifetime}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToastContainer;

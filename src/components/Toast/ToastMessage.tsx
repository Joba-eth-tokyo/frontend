import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ToastMessageProps } from '@/types';
import { toastMessageVariants } from '@/utils/constant';

import { CrossIcon } from '../icons';

const ToastMessage = ({
  id,
  header,
  title,
  message,
  lifetime,
  onRemove,
  // icon,
  type,
}: ToastMessageProps) => {
  const Var = type
    ? toastMessageVariants[type]
    : {
        base: 'bg-white border-gray-600 ',
        iconstyle: '',
        // icon,
        name: header,
      };

  useEffect(() => {
    if (lifetime && onRemove) {
      setTimeout(() => {
        onRemove(id);
      }, lifetime);
    }
  }, [lifetime]);

  return (
    <div
      className={twMerge(
        'flex w-full visible flex-row shadow-lg border border-opacity-20 rounded-md cursor-pointer transform transition-all duration-300 hover:scale-105',
        Var.base,
        type && 'max-h-40'
      )}
    >
      <div className="flex w-full flex-row flex-nowrap p-2">
        <div className="flex w-full flex-col flex-nowrap px-1">
          <div className="my-auto flex select-none font-bold">{title}</div>
          <p
            className={twMerge(
              '-mt-0.5 my-auto break-all flex',
              'text-gray-600 text-sm'
            )}
          >
            {message}
          </p>
        </div>
        <div
          onClick={() => onRemove && onRemove(id)}
          className={twMerge(
            'w-10 h-12 flex items-center justify-center text-center leading-none text-lg'
          )}
        >
          <CrossIcon className="w-4 stroke-brandBlack-100" />
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;

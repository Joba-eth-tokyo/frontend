import { useState } from 'react';
import { twJoin } from 'tailwind-merge';

import type { CollapseProps } from '@/types';

import { MinusIcon, PlusIcon } from '../icons';

const Collapse = ({ title, description, id }: CollapseProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      key={id}
      className="border-b border-base-200 py-6 transition-all duration-300 last-of-type:border-0"
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center justify-between"
      >
        <div className="w-[95%] text-base font-semibold leading-7 text-primary-500 md:text-lg md:font-bold">
          {title}
        </div>
        <button className="select-none">
          {open ? (
            <MinusIcon className="h-5 w-5 stroke-brandOrange-100" />
          ) : (
            <PlusIcon className="h-5 w-5 stroke-brandOrange-100" />
          )}
        </button>
      </div>

      <div
        className={twJoin(
          'mt-2 mr-6 text-sm leading-5 md:text-base text-base-300 transition-all duration-200',
          open ? 'opacity-100' : 'opacity-0 h-0'
        )}
      >
        {description}
      </div>
    </div>
  );
};

export default Collapse;

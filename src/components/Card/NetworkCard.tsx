import Link from 'next/link';
import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import type { NetworkCardProps } from '@/types';

const NetworkCard = ({
  title,
  description,
  linkLabel,
  href,
  members,
  backgroundColor,
}: NetworkCardProps) => {
  return (
    <div
      className={twJoin(
        'px-5 py-8 md:p-8 flex flex-col justify-between rounded-lg',
        backgroundColor
      )}
    >
      <div className="space-y-4">
        <h3 className="text-base font-bold text-primary-500 md:text-xl">
          {title}
        </h3>
        <p className="text-sm font-normal text-primary-100 md:w-9/12 md:text-base">
          {description}
        </p>
      </div>
      <div
        className={twMerge(
          'flex flex-1 flex-wrap items-end  justify-end gap-4  pt-6 lg:gap-8',
          members?.length ? 'justify-between' : ''
        )}
      >
        {members && members.length > 0 && (
          <div className="space-y-5 md:space-y-1">
            <div className="flex -space-x-3">
              {members.map((member) => (
                <img
                  key={member.id}
                  className="h-8 w-8 rounded-full md:h-10 md:w-10"
                  src={member.image}
                  alt={member.name}
                />
              ))}
            </div>
            <div className="text-10px text-primary-100">
              More than 2,000 others joined
            </div>
          </div>
        )}

        <Link href={href || '/'} passHref className="block sm:inline-block ">
          <div className="flex w-full items-center gap-7 text-base font-semibold leading-150 text-gray-700">
            <span>{linkLabel}</span>
            <div className="grid h-12  w-12 place-content-center rounded-full bg-primary-200">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.31371 0.313849V2.30789L9.2121 2.31496L0.606608 10.9205L2.02082 12.3347L10.6263 3.72917L10.6334 11.6276H12.6274V0.313849H1.31371Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NetworkCard;

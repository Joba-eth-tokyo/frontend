import React from 'react';
import { twMerge } from 'tailwind-merge';

import { formatCurrency } from '@/utils/formatCurrency';

import { WalletIcon } from '../icons';

interface BalanceInfoProps {
  wrapperClassName?: string;
  iconClassName?: string;
  className?: string;
  amountClassName?: string;
}

const BalanceInfo: React.FC<BalanceInfoProps> = ({
  wrapperClassName,
  iconClassName,
  className,
  amountClassName,
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center  gap-3  px-5 py-3',
        wrapperClassName
      )}
    >
      <WalletIcon
        className={twMerge('h-4 w-4 stroke-primary-200', iconClassName)}
      />
      <p
        className={twMerge(
          'flex items-center gap-2 text-xs font-semibold leading-4 text-primary-200',
          className
        )}
      >
        <span className="font-normal">Balance:</span>
        <span className={amountClassName}>{formatCurrency(7540)}</span>
      </p>
    </div>
  );
};

export default BalanceInfo;

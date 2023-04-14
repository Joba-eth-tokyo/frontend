import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { LoaderIcon } from '../icons';

interface IButton {
  children: React.ReactNode;
  className?: string;
  buttonType?: 'primary' | 'secondary' | 'dark' | 'outlined';
  size?: 'small' | 'big';
  leftSideIcon?: React.ReactNode;
  rightSideIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<
  IButton & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  children,
  className,
  buttonType = 'primary',
  size = 'big',
  leftSideIcon,
  rightSideIcon,
  isLoading,
  ...props
}) => {
  // Construct class name for button according to props
  const constructedClassName = useMemo(() => {
    let name =
      'text-base font-semibold rounded-lg flex items-center justify-center gap-2.5 group disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-400 disabled:pointer-events-none ';
    // Set height of button according to type
    name +=
      size === 'small'
        ? ' sm:py-3 py-2 px-6 sm:px-8'
        : ' sm:py-5 sm:px-12 py-3 px-8';

    // Coloring buttons correctly according to primary of a button
    switch (buttonType) {
      case 'primary':
        name +=
          ' bg-button-gradient text-white hover:text-yellow-200 hover:bg-gradient-to-r hover:from-primary-900 hover:to-primary-900 transition-all duration-300 ease-in-out  ';
        break;
      case 'dark':
        name += ' bg-primary-900 text-yellow-200';
        break;
      case 'secondary':
        name += ' bg-primary-500 text-white hover:text-yellow-200';
        break;
      case 'outlined':
        name +=
          ' text-gray-700 border-gray-700 border hover:bg-brandWhite-200 disabled:border-gray-400 fill-primary-100 disabled:opacity-40 dark:border-yellow-200 dark:bg-transparent dark:fill-gray-25 dark:text-gray-25';
        break;

      default:
        break;
    }
    return name;
  }, [size, buttonType]);

  return (
    <button className={twMerge(constructedClassName, className)} {...props}>
      {isLoading ? (
        <LoaderIcon className="h-6 w-6 animate-spin stroke-white" />
      ) : (
        <>
          {leftSideIcon}
          <div>{children}</div>
          {rightSideIcon}
        </>
      )}
    </button>
  );
};

export default Button;

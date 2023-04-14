import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IContainer {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<IContainer> = ({ children, className = '' }) => {
  return (
    <div className={twMerge('max-w-7xl w-full mx-auto px-6', className)}>
      {children}
    </div>
  );
};

export default Container;

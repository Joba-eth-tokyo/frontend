import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
  wrapperClassName?: string;
};

const Main = ({ meta, children, wrapperClassName }: IMainProps) => (
  <div className="flex min-h-screen w-full flex-col font-jakarta text-gray-700 antialiased">
    {meta}
    <main className={twMerge('h-full w-full', wrapperClassName)}>
      {children}
    </main>
  </div>
);

export { Main };

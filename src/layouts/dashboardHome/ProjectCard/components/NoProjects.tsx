import { useRouter } from 'next/router';
import React from 'react';

import Button from '@/components/Button';
import { EmptyFolderIcon } from '@/components/icons';

interface NoProjectsProps {
  title?: string;
  isRedirectButton?: boolean;
}

const NoProjects: React.FC<NoProjectsProps> = ({ title, isRedirectButton }) => {
  const router = useRouter();
  return (
    <div className="grid min-h-[200px] flex-1 place-content-center md:min-h-[280px]">
      <div className="space-y-4 ">
        <EmptyFolderIcon className="mx-auto h-16 w-16 md:h-auto md:w-auto" />
        <p className="text-xs font-medium leading-4 text-brandGray-500 dark:text-yellow-200 sm:text-sm ">
          {title ?? 'No Projects yet'}
        </p>
        {isRedirectButton && (
          <div className="flex w-full items-center justify-center pt-3">
            <Button
              size="small"
              onClick={() => {
                router.push('/home');
              }}
            >
              Go to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoProjects;

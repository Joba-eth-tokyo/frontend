import Link from 'next/link';
import React from 'react';

import { CopyIcon, DotsIcon } from '@/components/icons';
import { useToast } from '@/context/Toast';
import { URLS } from '@/utils/urls';

export enum ProjectCardVariants {
  SUCCESS = 'complete',
  REFUND = 'refunded',
  DISPUTE = 'dispute',
  IN_PROGRESS = 'in progress',
  IN_REVIEW = 'in review',
  AWAITING_ACCEPTANCE = 'awaiting acceptance',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

interface ProjectCardItempProps {
  name: string;
  id: string;
  role: string;
  variant: ProjectCardVariants;
  showStatus?: boolean;
}

const ProjectCardItem: React.FC<ProjectCardItempProps> = ({
  name,
  id,
  role,
  variant,
  showStatus,
}) => {
  const { toastSuccess } = useToast();

  const handleCopy = (url: string) => {
    if (navigator) {
      navigator.clipboard.writeText(url);
      toastSuccess('Success', 'Link copied!');
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-5 py-4 dark:bg-brandBlack-100">
      <Link href={`${URLS.VIEW_PROJECT}${id}`}>
        <p className="line-clamp-1 flex-1 text-sm font-medium leading-4 dark:text-yellow-200">
          {name}
        </p>
      </Link>

      <div className="flex items-center gap-6">
        {variant === ProjectCardVariants.SUCCESS && (
          <div className="rounded-2xl bg-brandWhite-300 px-2 py-1 dark:bg-yellow-200/5">
            <p className="line-clamp-1 text-xs leading-5 text-brandRed-200 dark:text-yellow-200">
              {role}
            </p>
          </div>
        )}
        {variant && showStatus && (
          <p className="inline-block rounded-full bg-brandWhite-200 px-2.5  py-1 text-xs capitalize text-brandGray-400 dark:bg-brandWhite-200/5  dark:text-yellow-200">
            {variant}
          </p>
        )}

        <div
          className="cursor-pointer"
          onClick={() =>
            handleCopy(
              `${window.location.origin}${URLS.VIEW_PROJECT}${id}` as string
            )
          }
          title="copy link"
        >
          <CopyIcon className="w-4 fill-primary-100 dark:fill-yellow-200" />
        </div>

        <div className="grid h-6 w-6 cursor-pointer place-content-center rounded-full">
          <DotsIcon className="fill-primary-600 dark:fill-yellow-200" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardItem;

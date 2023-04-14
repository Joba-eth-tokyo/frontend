import React from 'react';

const ProjectCardItemSkeleton = () => {
  return (
    <div className="rounded-xl bg-white px-5 py-4 dark:bg-brandBlack-100">
      <div className="flex h-full animate-pulse items-center gap-4">
        <div className="h-4 flex-1 rounded-md bg-gray-300 "></div>
        <div className="h-4 w-6 rounded-md bg-gray-300 "></div>
      </div>
    </div>
  );
};

export default ProjectCardItemSkeleton;

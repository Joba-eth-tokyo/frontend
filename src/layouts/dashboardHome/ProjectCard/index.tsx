import clsx from 'clsx';
import React, { useMemo } from 'react';

import type { ProjectData } from '@/types';

import NoProjects from './components/NoProjects';
import ProjectCardItem, {
  ProjectCardVariants,
} from './components/ProjectCardItem';
import ProjectCardItemSkeleton from './components/ProjectCardItemSkeleton';

interface ProjectCardProps {
  variant: ProjectCardVariants;
  title: string;
  projectList: ProjectData[];
  loading: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  variant,
  title,
  projectList,
  loading,
}) => {
  const filteredProjects = useMemo(() => {
    if (!projectList.length) return [];

    return projectList.filter((project) => project.status === variant);
  }, [projectList]);

  return (
    <div className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-lg bg-brandWhite-200 px-4 py-5 dark:bg-primary-500 sm:w-80 md:p-5 lg:w-[354px]">
      <div
        className={clsx(
          'flex items-center justify-between  gap-2 border-b-[3px] pb-3.5 md:pb-5',
          {
            'border-brandGray-600': variant === ProjectCardVariants.PENDING,
            'border-brandGreen-100': variant === ProjectCardVariants.SUCCESS,
            'border-yellow-400': [
              ProjectCardVariants.REFUND,
              ProjectCardVariants.IN_PROGRESS,
            ].includes(variant),
            'border-brandPurple-100': variant === ProjectCardVariants.DISPUTE,
            'border-brandRed-200': variant === ProjectCardVariants.REJECTED,
          }
        )}
      >
        <div className="flex  items-center gap-2">
          <div
            className={clsx('h-2 w-2 shrink-0 rounded-full bg-brandGreen-100', {
              'bg-brandGreen-100': variant === ProjectCardVariants.SUCCESS,
              'bg-yellow-400': [
                ProjectCardVariants.REFUND,
                ProjectCardVariants.IN_PROGRESS,
              ].includes(variant),
              'bg-brandPurple-100': variant === ProjectCardVariants.DISPUTE,
              'bg-brandRed-200': variant === ProjectCardVariants.REJECTED,
              'border-brandGray-600': variant === ProjectCardVariants.PENDING,
            })}
          ></div>
          <p className="text-sm font-medium leading-4 text-primary-600 dark:text-yellow-200  md:text-base md:leading-5">
            {title}
          </p>
        </div>

        <div className="grid h-5 w-5 place-content-center rounded-full bg-brandGray-100 text-xs font-medium leading-4 text-brandGray-500 dark:bg-yellow-200">
          {filteredProjects.length}
        </div>
      </div>{' '}
      <div className="space-y-3 pt-4">
        {loading ? (
          [1, 2, 3].map((key) => <ProjectCardItemSkeleton key={key} />)
        ) : (
          <div className="min-h-[200px] space-y-3 md:min-h-[280px]">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: ProjectData) => (
                <ProjectCardItem
                  key={project.id}
                  id={project.id as string}
                  name={project.name}
                  role={project.role}
                  variant={variant}
                />
              ))
            ) : (
              <NoProjects />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getProjects } from '@/api/project';
import { LoaderIcon } from '@/components/icons';
import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';
import Header from '@/layouts/dashboardHome/Header';
import NoProjects from '@/layouts/dashboardHome/ProjectCard/components/NoProjects';
import type { ProjectCardVariants } from '@/layouts/dashboardHome/ProjectCard/components/ProjectCardItem';
import ProjectCardItem from '@/layouts/dashboardHome/ProjectCard/components/ProjectCardItem';
import Dashboard from '@/templates/Dashboard';
import type { ProjectData } from '@/types';
import { URLS } from '@/utils/urls';

const Projects = () => {
  const router = useRouter();
  const { userData, loading: userLoading } = useAuth();
  const { toastError } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [projectList, setProjectList] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (!userLoading && !userData) {
      router.replace(URLS.ROOT);
    }
  }, [userData, userLoading]);

  const fetchAllProjects = async () => {
    try {
      const response = await getProjects();
      setProjectList(response.data.data);
      setLoading(false);
    } catch (error: any) {
      toastError('Error!', error.response.data.msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin stroke-base-100" />
      </div>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6 md:space-y-0">
        <Header title="Projects" />
        <div className="flex flex-1 flex-col space-y-4 rounded-lg bg-brandWhite-200 px-4 py-5 dark:bg-primary-500 md:p-8">
          {loading ? (
            <p className="line-clamp-1 flex-1 text-sm font-medium leading-4 dark:text-yellow-200">
              Loading
            </p>
          ) : (
            <div className="space-y-3">
              {projectList.length ? (
                projectList.map((project: ProjectData) => (
                  <ProjectCardItem
                    key={project.id}
                    id={project.id as string}
                    name={project.name}
                    role={project.role}
                    variant={project.status as ProjectCardVariants}
                    showStatus
                  />
                ))
              ) : (
                <NoProjects />
              )}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Projects;

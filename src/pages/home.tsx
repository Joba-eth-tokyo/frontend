// import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getProjects } from '@/api/project';
import Button from '@/components/Button';
import {
  // DotsIcon,
  // FolderIcon,
  LoaderIcon,
  // MessageIcon,
} from '@/components/icons';
import { useAuth } from '@/context/auth';
import Header from '@/layouts/dashboardHome/Header';
import ProjectCard from '@/layouts/dashboardHome/ProjectCard';
import { ProjectCardVariants } from '@/layouts/dashboardHome/ProjectCard/components/ProjectCardItem';
import Dashboard from '@/templates/Dashboard';
import type { ProjectData } from '@/types';
import { URLS } from '@/utils/urls';

const Home = () => {
  const router = useRouter();
  const { userData, loading } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !userData) {
      router.replace(URLS.ROOT);
    }
  }, [userData, loading]);

  async function fetchAllProjects() {
    setApiLoading(true);
    try {
      const response = await getProjects();
      setProjects(response.data.data);
      setApiLoading(false);
    } catch (error) {
      setApiLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin stroke-base-100" />
      </div>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6 md:space-y-0">
        <Header />

        <div className="rounded-lg bg-white px-4 py-6 dark:bg-brandBlack-100 md:rounded-b-none md:p-8">
          <p className="mb-6 text-base font-semibold leading-5 dark:text-yellow-200">
            Projects
          </p>
          <div className="relative mb-4 flex flex-col flex-wrap items-stretch justify-center gap-8 sm:flex-row sm:gap-3">
            <ProjectCard
              variant={ProjectCardVariants.PENDING}
              title="Pending"
              projectList={projects}
              loading={apiLoading}
            />
            <ProjectCard
              variant={ProjectCardVariants.IN_PROGRESS}
              title="In Progress"
              projectList={projects}
              loading={apiLoading}
            />
            <ProjectCard
              variant={ProjectCardVariants.SUCCESS}
              title="Successful"
              projectList={projects}
              loading={apiLoading}
            />

            <ProjectCard
              variant={ProjectCardVariants.DISPUTE}
              title="Dispute"
              projectList={projects}
              loading={apiLoading}
            />
            <ProjectCard
              variant={ProjectCardVariants.REJECTED}
              title="Declined"
              projectList={projects}
              loading={apiLoading}
            />
            {!apiLoading && !projects.length && (
              <div className="absolute inset-0 grid place-content-center overflow-hidden rounded-lg  bg-black/80">
                <Link href={URLS.CREATE_PROJECT} passHref>
                  <Button
                    className=" h-11 text-sm  sm:px-8 sm:py-3"
                    buttonType="primary"
                  >
                    Create your first project
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/*
          No required right now. May be used in future
        
        <div className="rounded-lg bg-white px-4 py-6 dark:bg-brandBlack-100 md:rounded-t-none md:p-8 md:pt-0">
          <p className="mb-6 text-base font-semibold leading-5 text-brandGray-500 dark:text-yellow-200 md:text-xl md:leading-8">
            Projects you might be interested in
          </p>
          <div className="grid flex-1 gap-4 rounded-2xl bg-brandWhite-200 px-3 py-4 dark:bg-primary-500 sm:grid-cols-2 md:gap-8 md:px-5 md:py-6 lg:gap-12 xl:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-44 flex-1 flex-col rounded-2xl border bg-white p-5 dark:border-brandGray-600  dark:bg-primary-500 md:max-w-xs md:p-5"
              >
                <div className="flex-1 space-y-1 md:space-y-2">
                  <div className="flex items-center justify-between gap-1 md:gap-2">
                    <p className="line-clamp-1 text-lg font-medium leading-6 text-primary-600  dark:text-yellow-200">
                      GeegPay Development
                    </p>
                    <div className="cursor-pointer">
                      <DotsIcon className="w-4 fill-primary-600 dark:fill-yellow-200" />
                    </div>
                  </div>
                  <p className="text-xs leading-4 text-base-100">
                    Brainstorming brings team members diverse experience into
                    play.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-4">
                  <Image
                    width={24}
                    height={24}
                    src={'/assets/images/avatar-1.png'}
                    alt="user"
                  />
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-1">
                      <MessageIcon className="w-3.5 stroke-base-100 md:w-4" />
                      <p className="text-xs font-medium leading-4 text-base-100">
                        12 comments
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderIcon className="w-3.5 stroke-base-100 md:w-4" />
                      <p className="text-xs font-medium leading-4 text-base-100">
                        0 files
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </Dashboard>
  );
};

export default Home;

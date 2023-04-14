import httpCommon from '@/services/httpCommon';
import type { ProjectData } from '@/types';

export const createProject = (data: ProjectData) => {
  return httpCommon.post('/project', data);
};

export const getProjects = () => {
  return httpCommon.get('/project');
};

export const getProjectById = (id: string) => {
  return httpCommon.get(`/project/${id}`);
};

export const updateProjectStatus = (data: { id: string; status: string }) => {
  return httpCommon.post('/project/update-status', data);
};

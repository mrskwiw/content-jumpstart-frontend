import apiClient from './client';
import type { Project, ProjectStatus } from '@/types/domain';

export interface ProjectFilters {
  clientId?: string;
  status?: ProjectStatus;
  search?: string;
  limit?: number;
}

export interface CreateProjectInput {
  clientId: string;
  name: string;
  templates: string[];
  platforms: string[];
  tone?: string;
}

export interface UpdateProjectInput {
  name?: string;
  status?: ProjectStatus;
  templates?: string[];
  platforms?: string[];
  tone?: string;
}

export const projectsApi = {
  async list(params?: ProjectFilters) {
    const { data } = await apiClient.get<Project[]>('/api/projects', { params });
    return data;
  },

  async get(projectId: string) {
    const { data } = await apiClient.get<Project>(`/api/projects/${projectId}`);
    return data;
  },

  async create(input: CreateProjectInput) {
    const { data } = await apiClient.post<Project>('/api/projects', input);
    return data;
  },

  async update(projectId: string, input: UpdateProjectInput) {
    const { data } = await apiClient.patch<Project>(`/api/projects/${projectId}`, input);
    return data;
  },
};

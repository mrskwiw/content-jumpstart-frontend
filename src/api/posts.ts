import apiClient from './client';
import type { PostDraft } from '@/types/domain';

export interface PostFilters {
  projectId?: string;
  runId?: string;
  status?: string;
}

export const postsApi = {
  async list(filters?: PostFilters) {
    const { data } = await apiClient.get<PostDraft[]>('/api/posts', { params: filters });
    return data;
  },
};

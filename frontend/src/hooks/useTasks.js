import { useQuery } from '@tanstack/react-query';
import { getTasks, getTasksByProject } from '../services/taskService';

export const useTasks = (projectId) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => (projectId ? getTasksByProject(projectId) : getTasks()),
  });
};

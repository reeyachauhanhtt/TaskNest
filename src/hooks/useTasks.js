import { useQuery } from '@tanstack/react-query';

export const useTasks = (projectId) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () =>
      projectId
        ? getTasks(projectId)
        : fetch('http://localhost:3000/tasks').then((res) => res.json()),
    enabled: projectId ? true : true,
  });
};

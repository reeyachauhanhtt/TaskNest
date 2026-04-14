import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../services/ProjectService';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
}

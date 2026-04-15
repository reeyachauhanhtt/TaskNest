import { useQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL;

const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

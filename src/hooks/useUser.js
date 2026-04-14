import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  const res = await fetch('http://localhost:3000/users');
  return res.json();
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('http://localhost:3000/users').then((res) => res.json()),
  });
};

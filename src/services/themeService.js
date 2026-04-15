const BASE_URL = import.meta.env.VITE_API_URL;

export const getUserTheme = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);

  if (!res.ok) throw new Error('Failed to fetch user theme');

  return res.json();
};

export const updateUserTheme = async (userId, theme) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });

  if (!res.ok) throw new Error('Failed to update theme');

  return res.json();
};

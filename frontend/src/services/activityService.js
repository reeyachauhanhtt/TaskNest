const BASE_URL = import.meta.env.VITE_API_URL;

export const createActivity = async (activity) => {
  const res = await fetch(`${BASE_URL}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });

  if (!res.ok) throw new Error('Failed to create activity');
  return res.json();
};

export const getActivitiesByTask = async (taskId) => {
  const res = await fetch(`${BASE_URL}/activities?taskId=${taskId}`);
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
};

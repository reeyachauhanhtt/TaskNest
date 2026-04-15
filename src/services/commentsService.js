const BASE_URL = import.meta.env.VITE_API_URL;

export const getCommentsByTask = async (taskId) => {
  const res = await fetch(`${BASE_URL}/comments?taskId=${taskId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
};

export const addComment = async (comment) => {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });

  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};

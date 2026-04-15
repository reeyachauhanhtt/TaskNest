const BASE_URL = import.meta.env.VITE_API_URL;

export const deleteTaskAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
};

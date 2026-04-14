export const deleteTaskAPI = async (id) => {
  const res = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
};

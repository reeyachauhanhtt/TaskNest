const BASE_URL = import.meta.env.VITE_API_URL;

//  GET ALL TASKS
export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

// GET TASKS BY PROJECT
export const getTasksByProject = async (projectId) => {
  const res = await fetch(`${BASE_URL}/tasks?projectId=${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch project tasks');
  return res.json();
};

// CREATE TASK
export const createTask = async (task) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

//  UPDATE TASK
export const updateTask = async (task) => {
  const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

//  UPDATE STATUS (KANBAN)
export const updateTaskStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error('Failed to update task status');
  return res.json();
};

//  DELETE TASK
export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete task');
};

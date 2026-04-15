const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(project) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error('Failed to create project');

  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export const updateProject = async (project) => {
  const res = await fetch(`${BASE_URL}/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
};

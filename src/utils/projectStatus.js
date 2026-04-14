export function getProjectStatus(projectId, tasks) {
  const projectTasks = tasks.filter(
    (t) => String(t.projectId) === String(projectId),
  );

  if (projectTasks.length === 0) return 'Active';

  const completed = projectTasks.filter(
    (t) => t.status?.toLowerCase() === 'done',
  ).length;

  const progress = (completed / projectTasks.length) * 100;

  if (progress === 100) return 'Completed';
  if (progress > 0) return 'In Progress';
  return 'Active';
}

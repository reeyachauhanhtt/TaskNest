export const isProjectMember = (project, userId) => {
  if (!project) return false;

  return project.admins?.includes(userId) || project.members?.includes(userId);
};

export const isProjectAdmin = (project, userId) => {
  return project?.admins?.includes(userId);
};

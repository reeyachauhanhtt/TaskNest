import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import classes from './Dashboard.module.css';
import useAuth from '../../hooks/Authentication';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import Cards from './DashboardCards/Cards';
import ProjectsPreview from './ProjectsPreview/ProjectsPreview';

import { getProjects, createProject } from '../../services/projectService';
import { getTasks } from '../../services/taskService';

export default function Dashboard() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErr,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErr,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  if (projectsLoading || tasksLoading) return <p>Loading dashboard...</p>;

  if (projectsError) return <p>{projectsErr.message}</p>;
  if (tasksError) return <p>{tasksErr.message}</p>;

  async function handleAddProject(project) {
    await createProject(project);
  }

  return (
    <>
      <div className={classes.layout}>
        <div className={classes.main}>
          <div className={classes.container}>
            <Cards projects={projects} tasks={tasks} />
            <ProjectsPreview projects={projects} tasks={tasks} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <CreateProjectModal
            onAdd={handleAddProject}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

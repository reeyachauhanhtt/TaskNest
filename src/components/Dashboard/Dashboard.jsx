import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import classes from './Dashboard.module.css';
import useAuth from '../../hooks/Authentication';
import CreateProjectModal from '../CreateProjectModal/CreateProjectModal';
import Cards from './DashboardCards/Cards';
import ProjectsPreview from './ProjectsPreview/ProjectsPreview';

const fetchProjects = async () => {
  const res = await fetch('http://localhost:3000/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

const fetchTasks = async () => {
  const res = await fetch('http://localhost:3000/tasks');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

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
    queryFn: fetchProjects,
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErr,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  if (projectsLoading || tasksLoading) return <p>Loading dashboard...</p>;

  if (projectsError) return <p>{projectsErr.message}</p>;
  if (tasksError) return <p>{tasksErr.message}</p>;

  async function handleAddProject(project) {
    await fetch('http://localhost:3000/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
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

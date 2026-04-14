import { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';

import classes from './KanbanPage.module.css';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import TaskModal from '../components/Tasks/TaskModal';
import useAuth from '../hooks/Authentication';

const KanbanPage = () => {
  const [open, setOpen] = useState(false);

  const { data: projects = [], isLoading } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState('');

  const navigate = useNavigate();

  const selectedProject = projects.find(
    (p) => String(p.id) === String(selectedProjectId),
  );
  const user = useAuth();

  if (isLoading || !user) return <p>Loading...</p>;

  const allowedProjects = projects.filter(
    (p) =>
      p.admins?.map(String).includes(String(user.user.id)) ||
      p.members?.map(String).includes(String(user.user.id)),
  );

  useEffect(() => {
    if (allowedProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(String(allowedProjects[0].id));
    }
  }, [allowedProjects]);

  // console.log('USER:', user);
  // console.log('PROJECTS:', projects);

  return (
    <div className={classes.container}>
      <div className={classes.kanbanHeader}>
        <button
          className={classes.iconBtn}
          onClick={() => navigate('/dashboard')}
        >
          ❮❮
        </button>

        <div className={classes.left}>
          {selectedProject && (
            <h2 className={classes.projectTitle}>{selectedProject.title}</h2>
          )}
        </div>

        <div className={classes.center}>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className={classes.projectDropdown}
          >
            <option value=''>Select Project</option>

            {allowedProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className={classes.right}>
          <button className={classes.addTaskBtn} onClick={() => setOpen(true)}>
            + Add Task
          </button>
        </div>
      </div>

      {/* <div className={classes.selectProject}>
        <h3>Select a project to get started...</h3>
      </div> */}

      {selectedProjectId && <KanbanBoard projectId={selectedProjectId} />}

      {open && (
        <TaskModal
          onClose={() => setOpen(false)}
          projectId={selectedProjectId}
        />
      )}
    </div>
  );
};

export default KanbanPage;

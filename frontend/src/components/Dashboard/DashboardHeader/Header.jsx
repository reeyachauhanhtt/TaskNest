import classes from './Header.module.css';

import useAuth from '../../../hooks/Authentication';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../../../services/projectService';

export default function Header({ onCreate }) {
  const { user } = useAuth();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const project = projects.find((p) => String(p.id) === id);

  function getTitle() {
    const path = location.pathname;

    if (path === '/dashboard') return 'Dashboard';
    if (path === '/projects') return 'All Projects';
    if (path.includes('/kanban')) return 'Kanban Board';
    if (path.startsWith('/project/')) return 'Project Details';
    if (path === '/calendar') return 'Calendar';
    if (path === '/settings') return 'Settings';

    return 'Dashboard';
  }
  // console.log('USER:', user);

  const fallbackAvatar = user?.firstName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <div className={classes.header}>
      <h2 className={classes.title}>{getTitle()}</h2>

      <div className={classes.right}>
        <span className={classes.user}>
          {user?.username} ({user?.role})
        </span>

        <div
          className={classes.avatarWrapper}
          onClick={() => navigate('/settings')}
        >
          <div className={classes.avatarFallback}>{fallbackAvatar}</div>
        </div>

        {user?.role?.toLowerCase() === 'admin' && (
          <button type='button' onClick={onCreate} className={classes.button}>
            + Create Project
          </button>
        )}
      </div>
    </div>
  );
}

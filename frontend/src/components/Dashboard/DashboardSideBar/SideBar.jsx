import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import classes from './SideBar.module.css';
import logo from '../../../assets/tasknest-logo-dark.png';

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const { id } = useParams();

  return (
    <aside
      className={`${classes.sidebar} ${collapsed ? classes.collapsed : ''}`}
    >
      <div className={classes.top}>
        <button
          className={classes.toggle}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          ☰
        </button>

        {!collapsed && (
          <div className={classes.logo}>
            <img src={logo} alt='logo' />
          </div>
        )}
      </div>

      <nav className={classes.nav}>
        <NavLink to='/dashboard' className={classes.link}>
          <span>
            <img src='/icons/dashboard.svg' className={classes.icon} />
          </span>
          {!collapsed && 'Dashboard'}
        </NavLink>

        <NavLink to='/projects' className={classes.link}>
          <span>
            <img src='/icons/projects.svg' className={classes.icon} />
          </span>
          {!collapsed && 'All Projects'}
        </NavLink>

        <NavLink to='/tasks' className={classes.link}>
          <span>
            <img src='/icons/my-tasks.svg' className={classes.icon} />
          </span>
          {!collapsed && 'My Tasks'}
        </NavLink>

        <NavLink to={'/kanban'} className={classes.link}>
          <span>
            <img src='/icons/kanban.svg' className={classes.icon} />
          </span>
          {!collapsed && 'Kanban'}
        </NavLink>

        <NavLink to='/calendar' className={classes.link}>
          <span>
            <img src='/icons/calendar.svg' className={classes.icon} />
          </span>
          {!collapsed && 'Calendar'}
        </NavLink>
      </nav>

      <div className={classes.bottom}>
        <NavLink to='/settings' className={classes.link}>
          <span>
            <img src='/icons/settings.svg' className={classes.icon} />
          </span>
          {!collapsed && 'Settings'}
        </NavLink>
      </div>
    </aside>
  );
}

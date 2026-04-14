import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Dashboard/DashboardSideBar/SideBar';
import Header from '../components/Dashboard/DashboardHeader/Header';
import classes from './AppLayout.module.css';
import CreateProjectModal from '../components/CreateProjectModal/CreateProjectModal';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  function handleCreateProject() {
    console.log('Clicked!!');
    setOpen(true);
  }

  function handleProjectCreated() {
    setRefresh((prev) => !prev);
  }

  return (
    <div className={classes.layout}>
      <Sidebar />

      <div className={classes.main}>
        <Header onCreate={handleCreateProject} />

        <div className={classes.content}>
          <Outlet context={{ refresh }} />
        </div>
      </div>
      {open && (
        <CreateProjectModal
          onClose={() => setOpen(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

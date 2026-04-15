import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

import classes from './CalendarPage.module.css';
import useAuth from '../hooks/Authentication';
import CalendarHeader from '../components/Calendar/CalendarHeader';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import TaskModal from '../components/Tasks/TaskModal';
import { useUsers } from '../hooks/useUser';

const CalendarPage = () => {
  const { data: usersData } = useUsers();

  const users = Array.isArray(usersData)
    ? usersData
    : usersData?.users || usersData?.data || [];

  const user = useAuth();

  const [view, setView] = useState('month');

  const { data: tasks = [] } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);

  if (!user) return <p>Loading...</p>;

  const userId = user.user.id;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // console.log('USER ID:', userId);
      // console.log('TASKS:', tasks);

      if (String(task.assignedTo) !== String(userId)) return false;

      if (filter === 'completed') return task.status === 'Done';
      if (filter === 'incomplete') return task.status !== 'Done';

      return true;
    });
  }, [tasks, filter, userId]);

  // console.log('USERS:', users);

  return (
    <div className={classes.page}>
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        filter={filter}
        setFilter={setFilter}
        view={view}
        setView={setView}
        onCreateTask={() => setOpen(true)}
      />

      <CalendarGrid
        currentDate={currentDate}
        tasks={filteredTasks}
        view={view}
        users={users}
      />

      {open && <TaskModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default CalendarPage;

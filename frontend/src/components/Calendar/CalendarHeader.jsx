import { useNavigate } from 'react-router-dom';
import classes from './CalendarHeader.module.css';

const CalendarHeader = ({
  view,
  currentDate,
  setCurrentDate,
  filter,
  setFilter,
  onCreateTask,
  setView,
}) => {
  const month = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const navigate = useNavigate();

  const goToPrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className={classes.header}>
      <button
        className={classes.iconBtn}
        onClick={() => navigate('/dashboard')}
      >
        ❮❮
      </button>
      <div className={classes.left}>
        <button className={classes.navBtn} onClick={goToPrevMonth}>
          ◀
        </button>
        <span className={classes.month}>{month}</span>
        <button className={classes.navBtn} onClick={goToNextMonth}>
          ▶
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className={classes.navBtn}
        >
          Today
        </button>
      </div>

      <div className={classes.center}>
        <select
          className={classes.select}
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value='month'>Month</option>
          <option value='week'>Week</option>
        </select>

        <select
          className={classes.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value='all'>All Tasks</option>
          <option value='completed'>Completed</option>
          <option value='incomplete'>Incomplete</option>
        </select>
      </div>

      <button className={classes.createBtn} onClick={onCreateTask}>
        + Create Task
      </button>
    </div>
  );
};

export default CalendarHeader;

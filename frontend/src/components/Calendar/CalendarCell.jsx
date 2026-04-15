import { useState } from 'react';

import UserAvatar from '../common/UserAvatar';
import classes from './CalendarCell.module.css';
import TaskTooltip from './TaskTooltip';

const CalendarCell = ({ date, tasks, users = [], currentDate }) => {
  const [hoveredTask, setHoveredTask] = useState(null);

  const today = new Date();

  if (!date) return <div className={classes.cell} />;

  const isToday = date.toDateString() === today.toDateString();

  const dayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;

    return new Date(t.dueDate).toDateString() === date.toDateString();
  });

  const visibleTasks = dayTasks.slice(0, 3);
  const extraCount = dayTasks.length - 3;

  const safeUsers = Array.isArray(users)
    ? users
    : users?.users || users?.data || [];

  const isCurrentMonth =
    currentDate && date.getMonth() === currentDate.getMonth();

  return (
    <div
      className={`${classes.cell} ${isToday ? classes.today : ''} ${!isCurrentMonth ? classes.otherMonth : ''}`}
    >
      <div className={classes.date}>{date.getDate()}</div>

      {visibleTasks.map((task) => {
        const assignedUser = safeUsers.find(
          (u) => String(u.id) === String(task.assignedTo),
        );

        return (
          <div
            key={task.id}
            className={`${classes.task} ${
              task.priority === 'High'
                ? classes.high
                : task.priority === 'Medium'
                  ? classes.medium
                  : classes.low
            }`}
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <span className={classes.title}>{task.title}</span>

            <div className={classes.right}>
              {assignedUser && (
                <UserAvatar user={assignedUser} size={20} showName={false} />
              )}

              <span
                className={classes.dot}
                style={{
                  background:
                    task.priority === 'High'
                      ? '#ef4444'
                      : task.priority === 'Medium'
                        ? '#f59e0b'
                        : '#10b981',
                }}
              />
            </div>

            {hoveredTask === task.id && <TaskTooltip task={task} />}
          </div>
        );
      })}

      {extraCount > 0 && (
        <span className={classes.more}>+{extraCount} more</span>
      )}
    </div>
  );
};

export default CalendarCell;

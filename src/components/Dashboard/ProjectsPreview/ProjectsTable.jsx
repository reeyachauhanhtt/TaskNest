import classes from './ProjectsTable.module.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useUsers } from '../../../hooks/useUser';
import useAuth from '../../../hooks/Authentication';
import { getProjectStatus } from '../../../utils/projectStatus';

export default function ProjectsTable({
  projects,
  tasks = [],
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const { data: users = [] } = useUsers();
  const { user } = useAuth();

  function getProjectUsers(project) {
    const teamIds = [...(project.admins || []), ...(project.members || [])];
    return users.filter((u) => teamIds.includes(u.id));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';

    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  function getDueStatus(dueDate) {
    if (!dueDate) return 'none';

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffDays = (due - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'soon';
    return 'none';
  }

  function getProjectProgress(projectId, tasks) {
    const projectTasks = tasks.filter(
      (t) => String(t.projectId) === String(projectId),
    );

    if (projectTasks.length === 0) return 0;

    const completed = projectTasks.filter(
      (t) => t.status?.toLowerCase() === 'done',
    ).length;

    return Math.round((completed / projectTasks.length) * 100);
  }

  function useCountUp(target, duration = 0.6) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = target / (duration * 60);

      const timer = setInterval(() => {
        start += increment;

        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }, [target]);

    return count;
  }

  return (
    <div className={classes.table}>
      <div className={classes.headerRow}>
        <span>Project</span>
        <span>Status</span>
        <span>Progress</span>
        <span>Team</span>
        <span>Start</span>
        <span>Due</span>
        <span>Actions</span>
      </div>

      {projects.map((p) => {
        const members = getProjectUsers(p);
        const dueStatus = getDueStatus(p.dueDate);
        const progress = getProjectProgress(p.id, tasks);
        const animatedProgress = useCountUp(progress);

        const isCompleted = progress === 100;
        // const displayStatus = isCompleted ? 'Completed' : p.status;

        const displayStatus = getProjectStatus(p.id, tasks);

        // const derivedStatus = progress === 100 ? 'Completed' : p.status;
        // console.log(p.title, p.status, progress);
        // console.log(p.title, p.dueDate, getDueStatus(p.dueDate));

        return (
          <div
            key={p.id}
            className={`${classes.row} ${isCompleted ? classes.doneRow : ''}`}
            onClick={() => navigate(`/project/${p.id}`)}
          >
            <div>
              <p className={classes.title}>{p.title}</p>
              <span className={classes.desc}>{p.description}</span>
            </div>

            <span
              className={`${classes.status} ${getStatusClass(displayStatus, classes)}`}
            >
              {displayStatus}
            </span>

            <div className={classes.progressWrapper}>
              <div className={classes.progressBar}>
                <motion.div
                  className={classes.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 80,
                    damping: 10,
                  }}
                  style={{
                    background:
                      progress === 100
                        ? '#22c55e'
                        : progress > 50
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                />
              </div>

              <span className={classes.percent}>{animatedProgress}%</span>
            </div>

            <div className={classes.team}>
              {members.slice(0, 4).map((u, i) => {
                const initials = `${u.firstName[0]}${u.lastName[0]}`;
                const isAdmin = p.admins?.includes(u.id);

                return (
                  <div
                    key={u.id}
                    className={classes.avatarWrapper}
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  >
                    <div className={classes.avatar}>{initials}</div>
                    {isAdmin && <span className={classes.crown}>👑</span>}
                  </div>
                );
              })}

              {members.length > 4 && (
                <div className={classes.extra}>+{members.length - 4}</div>
              )}
            </div>

            <span className={classes.date}>{formatDate(p.startDate)}</span>

            <span
              className={`${classes.date} ${
                displayStatus?.toLowerCase() !== 'completed'
                  ? dueStatus === 'overdue'
                    ? classes.overdueText
                    : dueStatus === 'soon'
                      ? classes.dueText
                      : ''
                  : ''
              }`}
            >
              {formatDate(p.dueDate)}

              {/* {dueStatus === 'overdue' && (
                <span className={classes.overdueBadge}> OVERDUE</span>
              )}

              {dueStatus === 'soon' && (
                <span className={classes.soonBadge}> ⚠</span>
              )} */}
            </span>

            <div className={classes.actions}>
              {user?.role === 'admin' && (
                <>
                  <img
                    src='/icons/edit.svg'
                    className={classes.actionIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(p);
                    }}
                  />
                  <img
                    src='/icons/delete.svg'
                    className={classes.actionIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(p.id);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStatusClass(status, classes) {
  if (status === 'Active') return classes.active;
  if (status === 'In Progress') return classes.progress;
  if (status === 'Completed') return classes.completed;
}

function getProgress(projectId, tasks = []) {
  if (!tasks.length) return 0;

  const projectTasks = tasks.filter(
    (t) => String(t.projectId) === String(projectId),
  );

  if (projectTasks.length === 0) return 0;

  const completed = projectTasks.filter(
    (t) => t.status?.toLowerCase() === 'done',
  ).length;

  return Math.round((completed / projectTasks.length) * 100);
}

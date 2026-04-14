import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import classes from './ProjectsPreview.module.css';
import { useUsers } from '../../../hooks/useUser';
import useAuth from '../../../hooks/Authentication';

export default function ProjectsPreview({ projects, tasks = [] }) {
  const navigate = useNavigate();
  const { data: users = [] } = useUsers();
  const { user } = useAuth();

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

  // SORT
  function sortProjects(projects, tasks) {
    const order = {
      Active: 1,
      'In Progress': 2,
      Completed: 3,
    };

    return [...projects].sort((a, b) => {
      const progressA = getProjectProgress(a.id, tasks);
      const progressB = getProjectProgress(b.id, tasks);

      const statusA = progressA === 100 ? 'Completed' : a.status;
      const statusB = progressB === 100 ? 'Completed' : b.status;

      return (order[statusA] || 99) - (order[statusB] || 99);
    });
  }

  const visibleProjects = sortProjects(projects, tasks).slice(0, 5);

  function getProjectUsers(project) {
    const teamIds = [...(project.admins || []), ...(project.members || [])];
    return users.filter((u) => teamIds.includes(u.id));
  }

  // PROJECT STATUS
  function getProjectProgress(projectId, tasks) {
    const projectTasks = tasks.filter((t) => t.projectId == projectId);

    if (projectTasks.length === 0) return 0;

    const completed = projectTasks.filter(
      (t) => t.status?.toLowerCase() === 'done',
    ).length;

    return Math.round((completed / projectTasks.length) * 100);
  }

  // ANIMATION OF PROGRESS BAR

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
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h3>Projects</h3>
        <span className={classes.viewAll} onClick={() => navigate('/projects')}>
          View all →
        </span>
      </div>

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

        {visibleProjects.map((p) => {
          const members = getProjectUsers(p);
          const dueStatus = getDueStatus(p.dueDate);
          const progress = getProjectProgress(p.id, tasks);
          const animatedProgress = useCountUp(progress);
          const isCompleted = progress === 100;
          const derivedStatus = progress === 100 ? 'Completed' : p.status;

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
                className={`${classes.status} ${getStatusClass(derivedStatus, classes)}`}
              >
                {derivedStatus}
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

                  return (
                    <div
                      key={u.id}
                      className={classes.avatar}
                      style={{ marginLeft: i === 0 ? 0 : -6 }}
                    >
                      {initials}
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
                  derivedStatus?.toLowerCase() !== 'completed'
                    ? dueStatus === 'overdue'
                      ? classes.overdueText
                      : dueStatus === 'soon'
                        ? classes.dueText
                        : ''
                    : ''
                }`}
              >
                {formatDate(p.dueDate)}
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
    </div>
  );
}

function getStatusClass(status, classes) {
  if (status === 'Active') return classes.active;
  if (status === 'In Progress') return classes.progress;
  return classes.completed;
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

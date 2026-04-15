import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import TaskModal from '../components/Tasks/TaskModal';
import classes from './ProjectDetailsPage.module.css';
import { deleteTaskAPI } from '../api/tasks';
import ConfirmModal from '../components/common/ConfirmModal';
import { useUsers } from '../hooks/useUser';
import useAuth from '../hooks/Authentication';
import TaskCommentsModal from '../components/Tasks/TaskCommentsModal';
import { isProjectMember, isProjectAdmin } from '../utils/permissions';

import { getTasks, deleteTask } from '../services/taskService';
import { getProjects } from '../services/projectService';

const fetchTasks = async () => {
  const res = await fetch('http://localhost:3000/tasks');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

const fetchProjects = async () => {
  const res = await fetch('http://localhost:3000/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

function getDueStatus(dueDate) {
  if (!dueDate) return 'none';

  const today = new Date();
  const due = new Date(dueDate);

  // normalize
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = (due - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'overdue'; //  past date
  if (diffDays <= 2) return 'soon'; //  near date
  return 'none';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';

  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data: users = [] } = useUsers();

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [commentTask, setCommentTask] = useState(null);

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErr,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErr,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const searchRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (tasksLoading || projectsLoading) return <p>Loading...</p>;
  if (tasksError) return <p>{tasksErr.message}</p>;
  if (projectsError) return <p>{projectsErr.message}</p>;

  const project = projects.find((p) => String(p.id) === id);

  if (!project) {
    return <p>Project not found</p>;
  }

  const canAccess = isProjectMember(project, user?.id);
  const isAdmin = isProjectAdmin(project, user?.id);

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setShowConfirm(false);
      setTaskToDelete(null);
    },
  });

  const projectTasks = tasks.filter((task) => task.projectId == id);

  const filteredTasks = projectTasks.filter((task) => {
    const search = debouncedSearch.toLowerCase();

    return (
      (task.title.toLowerCase().includes(search) ||
        (task.description || '').toLowerCase().includes(search)) &&
      (statusFilter === 'All' || task.status === statusFilter) &&
      (priorityFilter === 'All' || task.priority === priorityFilter)
    );
  });

  function handleEdit(task) {
    setEditTask(task);
    setOpen(true);
  }

  function handleDelete(task) {
    setTaskToDelete(task);
    setShowConfirm(true);
  }

  function confirmDelete() {
    deleteMutation.mutate(taskToDelete.id);
  }

  function getStatusClass(status) {
    const s = status?.toLowerCase();
    if (s === 'todo') return classes.todo;
    if (s === 'in progress' || s === 'inprogress') return classes.progress;
    return classes.done;
  }

  function getPriorityClass(priority) {
    const p = priority?.toLowerCase();
    if (p === 'low') return classes.low;
    if (p === 'medium') return classes.medium;
    return classes.high;
  }

  if (!canAccess) {
    return (
      <div className={classes.back}>
        <button
          onClick={() => navigate('/projects')}
          className={classes.backBtn}
        >
          ❮❮ Back to Projects
        </button>

        <div className={classes.denied}>
          <h3>Access Denied</h3>
          <p>You are not part of this project</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <button
          className={classes.iconBtn}
          onClick={() => navigate('/projects')}
        >
          ❮❮
        </button>

        <h2>{project.title} : Tasks</h2>

        <div className={classes.actionsRight}>
          <button className={classes.iconBtn} onClick={() => setOpen(true)}>
            <img src='/icons/add-task.svg' className={classes.icon} />
          </button>

          <div className={classes.searchWrapper} ref={searchRef}>
            {showSearch ? (
              <>
                <input
                  type='text'
                  placeholder='Search tasks...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={classes.searchInputInline}
                  autoFocus
                />
                <button
                  className={classes.iconBtn}
                  onClick={() => setShowSearch(false)}
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                className={classes.iconBtn}
                onClick={() => setShowSearch(true)}
              >
                <img src='/icons/search.svg' className={classes.icon} />
              </button>
            )}
          </div>

          <div className={classes.filterWrapper}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={classes.filterSelect}
            >
              <option value='All'>All Status</option>
              <option value='Todo'>Todo</option>
              <option value='In Progress'>In Progress</option>
              <option value='Done'>Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={classes.filterSelect}
            >
              <option value='All'>All Priority</option>
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>
          </div>
        </div>
      </div>

      <div className={classes.tableWrapper}>
        <div className={`${classes.row} ${classes.head}`}>
          <span>Title</span>
          <span>Assigned</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Start</span>
          <span>Due</span>
          <span>Actions</span>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const assignedUser = users.find((u) => u.id === task.assignedTo);

            const initials = assignedUser
              ? `${assignedUser.firstName[0]}${assignedUser.lastName[0]}`
              : '?';

            return (
              <div
                key={task.id}
                className={`${classes.row} 
  ${task.status?.toLowerCase() === 'done' ? classes.doneRow : ''}
`}
              >
                <span>{task.title}</span>

                <span className={classes.assignedWrapper}>
                  <div className={classes.avatar}>{initials}</div>
                  {assignedUser
                    ? `${assignedUser.firstName} ${assignedUser.lastName}`
                    : 'Unassigned'}
                </span>

                <span
                  className={`${classes.status} ${getStatusClass(task.status)}`}
                >
                  {task.status}
                </span>

                <span
                  className={`${classes.priority} ${getPriorityClass(task.priority)}`}
                >
                  {task.priority}
                </span>

                <span>{formatDate(task.startDate)}</span>

                <span
                  className={
                    task.status?.toLowerCase() !== 'done'
                      ? getDueStatus(task.dueDate) === 'overdue'
                        ? classes.overdueText
                        : getDueStatus(task.dueDate) === 'soon'
                          ? classes.dueText
                          : ''
                      : ''
                  }
                >
                  {formatDate(task.dueDate)}
                </span>

                <div className={classes.actions}>
                  <img
                    src='/icons/comment.svg'
                    className={classes.actionIcon}
                    onClick={() => setCommentTask(task)}
                  />
                  <img
                    src='/icons/edit.svg'
                    className={classes.actionIcon}
                    onClick={() => handleEdit(task)}
                  />
                  <img
                    src='/icons/delete.svg'
                    className={classes.actionIcon}
                    onClick={() => handleDelete(task)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className={classes.emptyState}>No tasks found</div>
        )}
      </div>

      {open && (
        <TaskModal
          onClose={() => {
            setOpen(false);
            setEditTask(null);
          }}
          projectId={id}
          editTask={editTask}
        />
      )}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        message='Do you want to delete this task?'
      />

      {commentTask && (
        <TaskCommentsModal
          task={commentTask}
          onClose={() => setCommentTask(null)}
        />
      )}
    </div>
  );
}

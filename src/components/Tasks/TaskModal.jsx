import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useUsers } from '../../hooks/useUser';
import { useProjects } from '../../hooks/useProjects';
import useAuth from '../../hooks/Authentication';
import classes from './TaskModal.module.css';
import MemberSelect from '../common/MemberSelect';

const addTaskAPI = async (task) => {
  const res = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error('Failed to add task');
  return res.json();
};

const updateTaskAPI = async (task) => {
  const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export default function TaskModal({
  onClose,
  editTask,
  projectId: incomingProjectId,
}) {
  const queryClient = useQueryClient();

  const { data: users = [] } = useUsers();
  const { data: projects = [] } = useProjects();
  const { user } = useAuth();

  const [projectId, setProjectId] = useState(incomingProjectId || '');

  const myProjects = projects.filter(
    (p) => p.members?.includes(user?.id) || p.admins?.includes(user?.id),
  );

  const project = myProjects.find((p) => String(p.id) === String(projectId));

  const teamMembers = users.filter((u) =>
    [...(project?.admins || []), ...(project?.members || [])].includes(u.id),
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: user?.id || '',
    status: 'Todo',
    priority: 'Low',
    startDate: '',
    dueDate: '',
  });

  useEffect(() => {
    if (editTask) {
      setFormData(editTask);
      setProjectId(editTask.projectId);
    }
  }, [editTask]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const addMutation = useMutation({
    mutationFn: addTaskAPI,
    onSuccess: async (newTask) => {
      await fetch('http://localhost:3000/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: newTask.id,
          userId: user.id,
          action: 'created task',
          createdAt: new Date().toISOString(),
        }),
      });

      queryClient.invalidateQueries(['tasks']);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTaskAPI,
    onSuccess: async (updatedTask) => {
      await fetch('http://localhost:3000/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: updatedTask.id,
          userId: user.id,
          action: 'updated task',
          createdAt: new Date().toISOString(),
        }),
      });

      queryClient.invalidateQueries(['tasks']);
      onClose();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) return;
    if (!projectId) return alert('Select project');

    if (editTask) {
      updateMutation.mutate({
        ...formData,
        projectId: projectId,
      });
    } else {
      addMutation.mutate({
        ...formData,
        projectId: projectId,
      });
    }
  }

  return (
    <div className={classes.backdrop}>
      <div className={classes.modal}>
        <h2>{editTask ? 'Edit Task' : 'Add Task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className={classes.formRow}>
            <label className={classes.label}>Title</label>
            <input
              className={classes.input}
              name='title'
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={classes.formRow}>
            <label className={classes.label}>Description</label>
            <textarea
              className={classes.textarea}
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={classes.dateGrid}>
            <div className={classes.field}>
              <label className={classes.label}>Start Date</label>
              <input
                type='date'
                name='startDate'
                value={formData.startDate}
                onChange={handleChange}
                className={classes.input}
              />
            </div>

            <div className={classes.field}>
              <label className={classes.label}>Due Date</label>
              <input
                type='date'
                name='dueDate'
                value={formData.dueDate}
                onChange={handleChange}
                className={classes.input}
              />
            </div>
          </div>

          <div className={classes.formRow}>
            <label className={classes.label}>Project</label>
            <select
              className={classes.select}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value=''>Select Project</option>
              {myProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label className={classes.label}>Assign To</label>

            <MemberSelect
              users={teamMembers}
              selected={formData.assignedTo}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  assignedTo: val,
                }))
              }
            />
          </div>

          <div className={classes.rowGrid}>
            <div className={classes.field}>
              <label className={classes.label}>Status</label>
              <select
                className={classes.select}
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                <option value='Todo'>Todo</option>
                <option value='In Progress'>In Progress</option>
                <option value='Done'>Done</option>
              </select>
            </div>

            <div className={classes.field}>
              <label className={classes.label}>Priority</label>
              <select
                className={classes.select}
                name='priority'
                value={formData.priority}
                onChange={handleChange}
              >
                <option value='Low'>Low</option>
                <option value='Medium'>Medium</option>
                <option value='High'>High</option>
              </select>
            </div>
          </div>

          <div className={classes.actions}>
            <button className={classes.primary} type='submit'>
              {editTask ? 'Update Task' : 'Add Task'}
            </button>

            <button className={classes.cancel} type='button' onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

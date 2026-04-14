import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import Modal from '../Modal/Modal';
import classes from './CreateProjectModal.module.css';
import { createProject, updateProject } from '../../services/ProjectService';
import { useUsers } from '../../hooks/useUser';
import MemberSelect from '../common/MemberSelect';

export default function CreateProjectModal({
  onClose,
  onCreated,
  editProject,
}) {
  const { data: users = [] } = useUsers();
  const queryClient = useQueryClient();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active',
    startDate: '',
    dueDate: '',
    tasks: '',
  });

  //  PREFILL DATA
  useEffect(() => {
    if (editProject) {
      setFormData({
        title: editProject.title || '',
        description: editProject.description || '',
        status: editProject.status || 'Active',
        startDate: editProject.startDate || '',
        dueDate: editProject.dueDate || '',
        tasks: editProject.tasks || '',
      });

      setSelectedAdmins(editProject.admins || []);
      setSelectedMembers(editProject.members || []);
    }
  }, [editProject]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  //  CREATE
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onCreated && onCreated();
      onClose();
    },
  });

  //  UPDATE
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onCreated && onCreated();
      onClose();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      admins: selectedAdmins,
      members: selectedMembers,
    };

    if (!formData.title.trim()) return;

    if (editProject) {
      updateMutation.mutate({
        ...payload,
        id: editProject.id,
      });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <Modal
      title={editProject ? 'Edit Project' : 'Create Project'}
      onClose={onClose}
    >
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.field}>
          <label>Title</label>
          <input
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.field}>
          <label>Description</label>
          <textarea
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
            />
          </div>

          <div className={classes.field}>
            <label className={classes.label}>Due Date</label>
            <input
              type='date'
              name='dueDate'
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.field}>
          <label>Number of Tasks</label>
          <input
            type='number'
            name='tasks'
            value={formData.tasks}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.field}>
          <label>Status</label>
          <select name='status' value={formData.status} onChange={handleChange}>
            <option value='Active'>Active</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
          </select>
        </div>

        <label>Assign Admins</label>
        <MemberSelect
          users={users.filter((u) => u.role === 'admin')}
          selected={selectedAdmins}
          onChange={setSelectedAdmins}
          multiple={true}
        />

        <div className={classes.field}>
          <label>Assign Members</label>
          <MemberSelect
            users={users.filter((u) => u.role === 'member')}
            selected={selectedMembers}
            onChange={setSelectedMembers}
            multiple={true}
          />
        </div>

        <div className={classes.action}>
          <button type='submit'>{editProject ? 'Update' : 'Create'}</button>

          <button type='button' onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

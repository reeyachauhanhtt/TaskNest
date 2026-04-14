import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import ProjectsTable from '../components/Dashboard/ProjectsPreview/ProjectsTable';
import classes from './ProjectsPage.module.css';
import ConfirmModal from '../components/common/ConfirmModal';
import CreateProjectModal from '../components/CreateProjectModal/CreateProjectModal';

const fetchProjects = async () => {
  const res = await fetch('http://localhost:3000/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3000/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  };

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  //  Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Sort

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

  // Filter + search
  const filteredProjects = sortProjects(
    projects.filter((project) => {
      const matchesSearch = project.title
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        project.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    }),
    tasks,
  );

  if (isLoading) {
    return <p style={{ padding: '1.5rem' }}>Loading projects...</p>;
  }

  if (isError) {
    return (
      <p style={{ padding: '1.5rem', color: 'red' }}>Error: {error.message}</p>
    );
  }

  //  DELETE
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/projects/${deleteId}`, {
        method: 'DELETE',
      });

      setIsDeleteOpen(false);
      setDeleteId(null);

      queryClient.invalidateQueries(['projects']);
    } catch (err) {
      console.error(err);
    }
  };

  //  EDIT
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // const handleSave = async (updatedProject) => {
  //   try {
  //     await fetch(`http://localhost:3000/projects/${updatedProject.id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(updatedProject),
  //     });

  //     setIsModalOpen(false);
  //     setSelectedProject(null);

  //     queryClient.invalidateQueries(['projects']);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <>
      <div className={classes.header}>
        <button
          className={classes.iconBtn}
          onClick={() => navigate('/dashboard')}
        >
          ❮❮
        </button>

        <div className={classes.actions}>
          <input
            type='text'
            placeholder='Search projects...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={classes.searchInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={classes.filter}
          >
            <option value='All'>All Status</option>
            <option value='Active'>Active</option>
            <option value='In Progress'>In Progress</option>In Progress
            <option value='Completed'>Completed</option>
          </select>
        </div>
      </div>

      <ProjectsTable
        projects={filteredProjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        tasks={tasks}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        message='Delete this project permanently?'
      />

      {isModalOpen && (
        <CreateProjectModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
          editProject={selectedProject}
          onCreated={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
}

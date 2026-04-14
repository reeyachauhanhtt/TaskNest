import { DragDropContext } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

import KanbanColumn from './KanbanColumn';
import TaskModal from '../Tasks/TaskModal';
import classes from './KanbanBoard.module.css';
import useAuth from '../../hooks/Authentication';

const fetchTasks = async (projectId) => {
  const res = await fetch(`http://localhost:3000/tasks?projectId=${projectId}`);
  return res.json();
};

export default function KanbanBoard({ projectId }) {
  const user = useAuth();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('Todo');

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
    enabled: !!projectId,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      return res.json();
    },

    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries(['tasks']);

      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old = []) =>
        old.map((task) =>
          String(task.id) === String(id)
            ? { ...task, status: newStatus }
            : task,
        ),
      );

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const userId = String(user.user.id);

  const projectTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        String(t.projectId) === String(projectId) &&
        String(t.assignedTo) === userId,
    );
  }, [tasks, projectId, userId]);

  // console.log('projectId:', projectId);
  // console.log('tasks:', tasks);
  // console.log('filtered:', projectTasks);

  if (!projectTasks.length) {
    return <p style={{ padding: '20px' }}>No tasks found</p>;
  }

  const columns = [
    {
      id: 'todo',
      title: 'Todo',
      status: 'Todo',
      tasks: projectTasks.filter((t) => t.status === 'Todo'),
    },
    {
      id: 'progress',
      title: 'In Progress',
      status: 'In Progress',
      tasks: projectTasks.filter((t) => t.status === 'In Progress'),
    },
    {
      id: 'done',
      title: 'Done',
      status: 'Done',
      tasks: projectTasks.filter((t) => t.status === 'Done'),
    },
  ];

  async function handleDragEnd(result) {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const draggedTask = projectTasks.find(
      (t) => String(t.id) === String(draggableId),
    );

    if (!draggedTask) return;

    const statusMap = {
      todo: 'Todo',
      progress: 'In Progress',
      done: 'Done',
    };

    const newStatus = statusMap[destination.droppableId];

    updateMutation.mutate({
      id: draggedTask.id,
      newStatus,
    });

    await fetch('http://localhost:3000/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: draggableId,
        userId: user.user.id,
        action: `moved task to ${newStatus}`,
        createdAt: new Date().toISOString(),
      }),
    });
  }

  function handleAddTask(status) {
    setDefaultStatus(status);
    setOpen(true);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.board}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={col.tasks}
              onAddTask={() => handleAddTask(col.status)}
            />
          ))}
        </div>
      </DragDropContext>

      {open && (
        <TaskModal
          onClose={() => setOpen(false)}
          projectId={projectId}
          defaultStatus={defaultStatus}
        />
      )}
    </>
  );
}

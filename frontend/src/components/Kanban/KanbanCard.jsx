import { Draggable } from '@hello-pangea/dnd';
import classes from './KanbanCard.module.css';
import { useUsers } from '../../hooks/useUser';
import useAuth from '../../hooks/Authentication';

export default function KanbanCard({ task, index }) {
  const authUser = useAuth();
  const userId = String(authUser.user.id);

  const { data: users = [] } = useUsers();

  const user = users.find((u) => u.id === task.assignedTo);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '?';

  return (
    <Draggable
      draggableId={String(task.id)}
      index={index}
      isDragDisabled={String(task.assignedTo) !== userId}
    >
      {(provided) => (
        <div
          className={classes.card}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className={classes.title}>{task.title}</p>

          <span
            className={`${classes.priority} ${
              classes[task.priority?.toLowerCase()]
            }`}
          >
            {task.priority}
          </span>

          <div className={classes.assignedWrapper}>
            <div className={classes.avatar}>{initials}</div>
            <p className={classes.assigned}>
              {user ? `${user.firstName} ${user.lastName}` : 'Unassigned'}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
}

import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import classes from './KanbanColumn.module.css';

export default function KanbanColumn({ id, title, tasks, onAddTask }) {
  return (
    <div className={classes.columnWrapper}>
      <div className={classes.columnHeader}>
        <span>{title}</span>
        <span className={classes.count}>{tasks.length}</span>
      </div>

      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.tasks}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button onClick={onAddTask} className={classes.addTask}>
        + Add Task
      </button>
    </div>
  );
}

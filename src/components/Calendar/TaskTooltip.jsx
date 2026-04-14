import classes from './TaskTooltip.module.css';

const TaskTooltip = ({ task }) => {
  return (
    <div className={classes.tooltip}>
      <div className={classes.title}>{task.title}</div>

      <div className={classes.meta}>{task.status}</div>

      <div className={classes.row}>
        <span>Start:</span> {task.startDate || 'N/A'}
      </div>

      <div className={classes.row}>
        <span>Due:</span> {task.dueDate || 'N/A'}
      </div>

      <div className={classes.row}>
        <span>Priority:</span> {task.priority}
      </div>
    </div>
  );
};

export default TaskTooltip;

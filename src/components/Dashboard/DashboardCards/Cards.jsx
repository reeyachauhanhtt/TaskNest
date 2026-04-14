import classes from './Cards.module.css';

export default function Cards({ projects, tasks }) {
  const totalTasks = tasks.length;

  const inProgress = projects.filter((p) => p.status === 'In Progress').length;

  const completed = projects.filter((p) => p.status === 'Completed').length;

  const activeProjects = projects.filter((p) => p.status === 'Active').length;

  const totalProjects = projects.length;

  const data = [
    { label: 'Total Tasks', value: totalTasks },
    { label: 'In Progress', value: inProgress },
    { label: 'Completed', value: completed },
    { label: 'Active Projects', value: activeProjects },
    { label: 'Projects', value: totalProjects },
  ];

  return (
    <div className={classes.grid}>
      {data.map((item, i) => (
        <div key={i} className={classes.card}>
          <div className={classes.top}>
            <span className={classes.label}>{item.label}</span>
          </div>

          <h2 className={classes.value}>{item.value}</h2>
        </div>
      ))}
    </div>
  );
}

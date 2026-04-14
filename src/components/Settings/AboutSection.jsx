import classes from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <div className={classes.wrapper}>
      <h2>About TaskNest</h2>
      <p>Smart Collaborative & WorkFlow Platform</p>

      <div className={classes.card}>
        <h3>🚀 Version</h3>
        <p>1.0.0</p>
      </div>

      <div className={classes.card}>
        <h3>👩‍💻 Built By</h3>
        <p>Reeya Chauhan</p>
      </div>

      <div className={classes.card}>
        <h3>✨ Features</h3>
        <ul>
          <li>Task Management</li>
          <li>Kanban Board</li>
          <li>Calendar View</li>
          <li>Team Collaboration</li>
        </ul>
      </div>
    </div>
  );
}

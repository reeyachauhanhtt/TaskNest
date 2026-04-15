import classes from './HelpSection.module.css';

export default function HelpSection() {
  return (
    <div className={classes.wrapper}>
      <h2>Help & Support</h2>
      <p>Find answers and get assistance</p>

      <div className={classes.grid}>
        <div className={classes.card}>
          <h3>📘 Documentation</h3>
          <p>Learn how to use features step-by-step</p>
        </div>

        <div className={classes.card}>
          <h3>💬 Contact Support</h3>
          <p>Reach out for help or report issues but not to me</p>
        </div>

        <div className={classes.card}>
          <h3>❓ FAQs</h3>
          <p>Quick answers to common questions</p>
        </div>
      </div>
    </div>
  );
}

import useTheme from '../../hooks/useTheme';
import classes from './ThemeSection.module.css';

export default function ThemeSection() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={classes.wrapper}>
      <h2>Appearance</h2>
      <p>Customize how your app looks and feels</p>

      <div className={classes.card}>
        <div className={classes.row}>
          <div>
            <h3>Theme</h3>
            <span className={classes.desc}>
              Switch between light and dark mode
            </span>
          </div>

          <button
            className={`${classes.toggle} ${
              theme === 'dark' ? classes.active : ''
            }`}
            onClick={toggleTheme}
          >
            <div className={classes.icon}>{theme === 'dark' ? '🌙' : '☀️'}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

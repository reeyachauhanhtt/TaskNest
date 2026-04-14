import classes from './AuthLayout.module.css';
import layoutImg from '../../assets/layout.png';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className={classes.root}>
      <div className={classes.card}>
        {/* ── Left: Form panel ── */}
        <div className={classes.left}>
          {title && <h1 className={classes.title}>{title}</h1>}
          {subtitle && <p className={classes.subtitle}>{subtitle}</p>}

          <div className={classes.formBody}>{children}</div>
        </div>

        {/* ── Right: Illustration panel ── */}
        <div className={classes.right}>
          <img src={layoutImg} alt='auth visual' className={classes.image} />
          <div className={classes.overlay} />
          <p className={classes.caption}>
            Finally, all your work in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

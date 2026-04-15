export default function Loader() {
  return (
    <div style={classes.container}>
      <div style={classes.loader}></div>
    </div>
  );
}

const classes = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1A1714',
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #44403C',
    borderTop: '4px solid #B45309',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'Unexpected error occurred';

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    message = error.data?.message || 'Page not found';
  }

  return (
    <div style={styles.container}>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1A1714',
    color: '#FEF3C7',
  },
};

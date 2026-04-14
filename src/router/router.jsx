import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorPage from '../pages/ErrorPage';

import Dashboard from '../components/Dashboard/Dashboard';
import LoginForm from '../components/Login/LoginForm';
import SignUpForm from '../components/SignUp/SignUpForm';
import ProjectsPage from '../pages/ProjectPages';
import ProjectDetailsPage from '../pages/ProjectDetailsPage';
import KanbanPage from '../pages/KanbanPage';
import MyTasksPage from '../pages/MyTasksPage';
import CalendarPage from '../pages/CalendarPage';
import SettingsPage from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />, //  default page
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignUpForm />,
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'project/:id', element: <ProjectDetailsPage /> },
      { path: '/kanban', element: <KanbanPage /> },
      { path: '/tasks', element: <MyTasksPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);


import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import UsersPage from '../pages/UsersPages';
import AddUserPage from '../pages/AddUserPage';
import EditUserPage from '../pages/EditUserPage';
import LoginPage from '../pages/LoginPage';
import Layout from '../components/navbar/Layout';

import HomePage from '../pages/HomePage';
import API from '../services/api';

// import ForgotPasswordPage from '../pages/forgotPasswordPage';
// import ResetPasswordPage from '../pages/ResetPasswordPage';
import InactivityHandler from '../components/utils/InactivityHandler';

// Import your new Project pages/components here:
import EditProjectForm from '../components/project/EditProjectForm';
import AddProjectForm from '../components/project/AddProjectForm';
import ProjectDetails from '../components/project/ProjectDetails';

import { loadCurrentUser, logout as logoutAction } from '../actions/userActions'; // adjust path as needed
import { useDispatch } from 'react-redux';


// import TaskList from '../components/task/TaskList';
import TaskDetailsPage from '../components/task/TaskDetailsPage';
import AddTaskForm from './../components/task/AddTaskForm';
import EditTaskDetails from '../components/task/EditTaskDetails';


const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    dispatch(logoutAction());
    setIsAuthenticated(false);
    navigate('/login');
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get('/users/me', { withCredentials: true });
        dispatch(loadCurrentUser())
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }


  return isAuthenticated ? (
    <>
      <InactivityHandler onTimeout={logout} />

      <Layout setIsAuthenticated={setIsAuthenticated} logout={logout}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UsersPage isAuthenticated={isAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/add-user"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/editUser/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditUserPage />
              </PrivateRoute>
            }
          />

          {/* === Project routes === */}

          <Route
            path="/projects/add"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddProjectForm onClose={() => window.history.back()} />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditProjectForm onClose={() => window.history.back()} />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <ProjectDetails />
              </PrivateRoute>
            }
          />

          {/* === Task routes === */}

          <Route
            path="/projects/:project_id/tasks/:task_id"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <TaskDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/projects/:projectId/add-task"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddTaskForm onClose={() => window.history.back()} />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:project_id/tasks/:task_id/edit"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <EditTaskDetails isEdit />
              </PrivateRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </>
  ) : (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />
      {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
      {/* <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;

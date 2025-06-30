import React, { useEffect, useState } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import Header from './Header';
import { AlertCircle } from 'lucide-react';

const Layout = ({ children, setIsAuthenticated, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Match routes including dynamic ones
  const isHome = location.pathname === '/';
  const isUsers = useMatch('/users');
  const isAddUser = useMatch('/users/add-user');
  const isLogin = useMatch('/login');
  const isAddProject = useMatch('/projects/add');
  const isEditProject = useMatch('/projects/:id/edit');
  const isProjectId = useMatch('/projects/:id')
  const isEditUser = useMatch('/users/edit/:id')
  const isTaskDetail = useMatch("/projects/:project_id/tasks/:task_id")
  const isAddTask = useMatch("/projects/:projectId/add-task")
  const isEditTask = useMatch("/projects/:project_id/tasks/:task_id/edit")

  // Determine title based on current route
  let hname = 'Dashboard';
  if (isHome) hname = 'Home';
  else if (isUsers) hname = 'Users';
  else if (isAddUser) hname = 'Add New User';
  else if (isLogin) hname = 'Login';
  else if (isAddProject) hname = 'Add New Project';
  else if (isEditProject) hname = 'Edit Project';
  else if (isProjectId) hname = 'Project Details '
  else if (isEditUser) hname = 'Edit User'
  else if (isTaskDetail) hname = 'Task Details'
  else if (isAddTask) hname = 'Add New Task'
  else if (isEditTask) hname = 'Edit Task'
  // Handle sidebar toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Sidebar open by default on desktop
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header
        hname={hname}
        isOpen={isOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        setIsAuthenticated={setIsAuthenticated}
        logout={logout}
      />
      <div
        className={`transition-all duration-300 pt-24 px-0 ${isMobile ? 'ml-0' : isOpen ? 'ml-64 lg:ml-74' : 'ml-24'
          }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;

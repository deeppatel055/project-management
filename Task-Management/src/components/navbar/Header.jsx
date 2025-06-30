import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from '../../actions/userActions';
import { NavLink } from 'react-router-dom';
import { Home, Menu, LogOut, Settings, ChevronDown, Plus, FolderPlus, MoreHorizontal, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { getAllProjects } from '../../actions/projectActions';
import homeIcon from './../../assets/home.svg';
import multiUser from './../../assets/multiUser.svg';
const Header = ({ hname, isOpen, isMobile, toggleSidebar, logout }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { projects = [] } = useSelector(state => state.projects);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    dispatch(loadCurrentUser());
    dispatch(getAllProjects());
  }, [dispatch]);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const handleMoreProjectsClick = () => {
    setShowAllProjects(!showAllProjects);
  };

  // Click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 5);

  return (
    <div className="relative">
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#E6E6E6] shadow-xl z-50 transition-all duration-300 ease-in-out border-r border-gray-200 
            ${isOpen ? 'w-64 sm:w-72 md:w-80 lg:w-64' : 'w-18 sm:w-18 md:w-18 lg:w-18'} 
            ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>

        <div className="flex flex-col h-full">
          {/* Header Logo Section */}
          <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 lg:p-4 border-b border-gray-200 min-h-[60px] sm:min-h-[64px] md:min-h-[68px] lg:min-h-[60px]
                ${!isOpen && !isMobile ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-8 lg:h-8 bg-[#5356FF] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-sm">T</span>
            </div>
            {(isOpen || isMobile) && (
              <span className="font-bold text-base sm:text-lg md:text-xl lg:text-lg bg-[#5356FF] bg-clip-text text-transparent truncate">
                Task Web
              </span>
            )}
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 p-2 sm:p-3 md:p-4 lg:p-4 space-y-1 flex flex-col overflow-hidden">
            {/* Dashboard Link */}
            <div className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${isActive ? 'bg-[#5356FF] text-white shadow-lg' : 'text-black hover:bg-[#dfdffb]'} 
                    flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-4 px-3 sm:px-4 md:px-5 lg:px-4 py-2.5 sm:py-3 md:py-3.5 lg:py-3 rounded-xl transition-all duration-200 
                    ${!isOpen && !isMobile ? 'justify-center' : ''} group`
                }
                onClick={() => isMobile && toggleSidebar()}
              >
                {/* <Home className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0" /> */}
                <img src={homeIcon} alt="" className="w-5 h-5"  />
                {(isOpen || isMobile) && (
                  <span className="text-sm sm:text-base md:text-lg lg:text-base truncate">
                    Dashboard
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Dashboard
                  </div>
                )}
              </NavLink>

              {/* Admin Users Link */}
              {['admin', 'superadmin'].includes(user?.role) && (
                <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${isActive ? 'bg-[#5356FF] text-white shadow-lg' : 'text-black hover:bg-[#dfdffb]'} 
                flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-4 px-3 sm:px-4 md:px-5 lg:px-4 py-2.5 sm:py-3 md:py-3.5 lg:py-3 rounded-xl transition-all duration-200 
                ${!isOpen && !isMobile ? 'justify-center' : ''} group relative`
              }
              onClick={() => isMobile && toggleSidebar()}
              >
                  {/* <Users className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0" /> */}
              <img src={multiUser} alt="" className="w-5 h-5"  />

                  {(isOpen || isMobile) && (
                    <span className="text-sm sm:text-base md:text-lg lg:text-base truncate">
                      Users
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Users
                    </div>
                  )}
                </NavLink>
              )}


              {/* Divider */}
              {(projects.length > 0 || user?.role === 'admin') && (
                <hr className="my-2 sm:my-2 md:my-3 lg:my-2 border-gray-300" />
              )}
            </div>

            {/* Projects List */}
            <div className={`flex-1 p-1 space-y-1    custom-scroll overflow-x-hidden ${isOpen ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
              {visibleProjects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={({ isActive }) =>
                    `${isActive ? 'bg-[#5356FF] text-white shadow-lg' : 'text-black hover:bg-[#dfdffb]'} 
                      flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-4 px-3 sm:px-4 md:px-5 lg:px-4 py-2.5 sm:py-3 md:py-3.5 lg:py-3 rounded-xl transition-all duration-200 
                      ${!isOpen && !isMobile ? 'justify-center' : ''} group relative`
                  }
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <FolderPlus className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                  {(isOpen || isMobile) && (
                    <span className="text-sm sm:text-base md:text-lg lg:text-base truncate" title={project.title}>
                      {project.title}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs">
                      {project.title}
                    </div>
                  )}
                </NavLink>
              ))}

              {/* More Projects Button */}
              {projects.length > 5 && (isOpen || isMobile) && (
                <button
                  onClick={handleMoreProjectsClick}
                  className="w-full flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-4 px-3 sm:px-4 md:px-5 lg:px-4 py-2.5 sm:py-3 md:py-3.5 lg:py-3 rounded-xl 
                      text-black hover:bg-[#dfdffb] transition-all duration-200 "
                >
                  <MoreHorizontal className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0 transition-transform duration-200 
                      ${showAllProjects ? 'rotate-90' : ''}`} />
                  <span className="text-sm sm:text-base md:text-lg lg:text-base">
                    {showAllProjects ? 'Show Less' : `Show ${projects.length - 5} More`}
                  </span>
                </button>
              )}
            </div>

            {/* Add Project Link (Admin only) */}
            {['admin', 'superadmin'].includes(user?.role) && (
              <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-2">
                <NavLink
                  to="/projects/add"
                  className={({ isActive }) =>
                    `${isActive ? 'bg-[#5356FF] text-white shadow-lg' : 'text-black hover:bg-[#dfdffb]'} 
                      flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-4 px-3 sm:px-4 md:px-5 lg:px-4 py-2.5 sm:py-3 md:py-3.5 lg:py-3 rounded-xl transition-all duration-200 
                      ${!isOpen && !isMobile ? 'justify-center' : ''} group relative`
                  }
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <Plus className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0" />
                  {(isOpen || isMobile) && (
                    <span className="text-sm sm:text-base md:text-lg lg:text-base truncate">
                      Add New Project
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!isOpen && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Add Project
                    </div>
                  )}
                </NavLink>
              </div>
            )}
          </nav>

          {/* Sidebar Toggle Button (Desktop only) */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-13 sm:top-13 md:top-13 lg:top-13 bg-white  border-gray-200 
                    rounded-full p-1.5 sm:p-2 md:p-2 lg:p-1.5 shadow-md hover:shadow-lg transition-all duration-200 z-10 
                    hover:scale-105 "
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
              ) : (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
              )}
            </button>
          )}
        </div>
      </aside>

      {/* Main Header */}
      <header className={`fixed top-0 right-0 transition-all duration-300 z-30 bg-[#F5F5F5]
              ${isOpen && !isMobile ? 'left-64 sm:left-72 md:left-80 lg:left-64' : !isMobile ? 'left-16 sm:left-16 md:left-16 lg:left-16' : 'left-0'}`}>

        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3 md:py-4 lg:py-4 h-[60px] sm:h-[64px] md:h-[68px] lg:h-[76px]">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 sm:p-2 md:p-2 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 
                    focus:outline-none focus:ring-2 focus:ring-[#5356FF] focus:ring-opacity-50 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-6 lg:h-6" />
            </button>
          )}

          {/* Page Title */}
          <h1 className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate flex-1 
                ${isMobile ? 'mx-2 sm:mx-3 md:mx-4' : 'mr-2 sm:mr-3 md:mr-4'} min-w-0`}>
            {hname}
          </h1>

          {/* User Menu */}
          <div className="relative user-menu-container flex-shrink-0">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 sm:gap-2 md:gap-2 lg:gap-3 p-1 sm:p-1.5 md:p-2 lg:p-2 rounded-xl hover:bg-gray-50 transition-colors"
              aria-label="User menu"
            >
              {/* User Info (Hidden on mobile and small tablets) */}
              <div className="hidden lg:block xl:block text-right">
                <p className="font-medium text-xs lg:text-sm xl:text-sm text-gray-900 truncate max-w-24 lg:max-w-32 xl:max-w-none">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-24 lg:max-w-32 xl:max-w-none">
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              {/* User Avatar */}
              <div className="relative">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.name || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-9 lg:h-9 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                      flex items-center justify-center text-white text-xs sm:text-sm md:text-sm lg:text-sm font-semibold ${user?.profile_picture ? 'hidden' : ''}`}>
                  {getUserInitials(user?.name)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-3 lg:h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 text-gray-400 transition-transform duration-200 
                    ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg 
                    py-2 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] z-50">

                {/* Mobile/Tablet User Info */}
                <div className="px-4 py-3 border-b border-gray-100 lg:hidden xl:hidden">
                  <p className="font-medium text-sm md:text-base text-gray-900 truncate">
                    {user?.name || 'User Name'}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>

                {/* Settings Button */}
                <button className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-gray-700 hover:bg-gray-50 
                      transition-colors duration-200 focus:outline-none focus:bg-gray-50">
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Settings</span>
                </button>

                <hr className="my-1 border-gray-100" />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-[#FF5B5B] hover:bg-[#fde6e6] 
                        transition-colors duration-200 focus:outline-none focus:bg-[#fde6e6]"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header Divider (Desktop only) */}
        {!isMobile && (
          <hr className="border-t-2 mx-4 sm:mx-6 md:mx-8 lg:mx-10 border-[#999999]" />
        )}
      </header>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
            .custom-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scroll::-webkit-scrollbar-thumb {
              background: #cbd5e0;
              border-radius: 2px;
            }
            .custom-scroll::-webkit-scrollbar-thumb:hover {
              background: #a0aec0;
            }
          `}</style>
    </div>
  );
};

export default Header;
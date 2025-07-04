import { useEffect, useState, useMemo } from 'react';
import { User, Trash2, Edit, Plus, Search, ChevronLeft, ChevronRight, Filter, X, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../../actions/userActions';
import Loading from '../common/Loading';
import DeleteModel from './../models/DeleteModel';
import EditLogo from '../../assets/edit.svg';


const UserList = ({ sidebarOpen, isMobile, isAuthenticated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteContent, setDeleteContent] = useState('');


  const { users, loading } = useSelector((state) => state.allUsers);


  const { user } = useSelector((state) => state.user);


  useEffect(() => {
    if (isAuthenticated && ['admin', 'superadmin'].includes(user?.role)) {
      dispatch(getAllUsers());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Global search
      const matchesSearch = searchTerm === '' ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mobile && user.mobile.includes(searchTerm));

      // Column filters
      const matchesNameFilter = columnFilters.name === '' ||
        user.name.toLowerCase().includes(columnFilters.name.toLowerCase());

      const matchesEmailFilter = columnFilters.email === '' ||
        user.email.toLowerCase().includes(columnFilters.email.toLowerCase());

      const matchesMobileFilter = columnFilters.mobile === '' ||
        (user.mobile && user.mobile.includes(columnFilters.mobile));

      return matchesSearch && matchesNameFilter && matchesEmailFilter && matchesMobileFilter;
    });
  }, [users, searchTerm, columnFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, columnFilters, itemsPerPage]);



  const confirmDelete = (user) => {
    // Safely check for user object fields
    setDeleteContent(`User "${user.name}"`);
    setUserToDelete(user);
    setShowModal(true);


  };

  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;

    await dispatch(deleteUser(userToDelete.id));
    setShowModal(false);
    setUserToDelete(null);
    setDeleteContent('');
  };

  const handleEditUser = (user) => {
    console.log('Navigating to edit user:', user);
    console.log('Navigating to edit user:',`/users/editUser/${user.id}`);
    navigate(`/users/editUser/${user.id}`);

  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return <Loading sidebarOpen={sidebarOpen} isMobile={isMobile} />;

  }

  return (
    <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64 lg:ml-72' : 'ml-0'}`}>
      <div className="p-4 sm:p-6 lg:p-0 lg:pr-10">


        {/* Top Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and Add Button Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#5356FF] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">

              <Link
                to="/users/add-user"
                className="flex items-center gap-2 bg-[#5356FF] text-white px-4 py-2.5 rounded-lg hover:bg-[#5356FF]/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
              </Link>
            </div>
          </div>

          {/* Advanced Filters (Collapsible) */}

          {/* Results Info and Items Per Page */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5356FF] focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {currentUsers.length > 0 ? (
            <div className="space-y-4">
              {currentUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profile_picture || 'public/images/default-profile.png'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-[#5356FF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="EditUser user"
                      >
                        {/* <EditUser className="w-4 h-4" /> */}
                        <img src={EditLogo} alt="Edit User" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(user)}
                        className="p-2 text-[#FF5B5B] hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 text-right break-all">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mobile:</span>
                      <span className="text-gray-900">{user.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Role:</span>
                      <span className="text-gray-900 capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || Object.values(columnFilters).some(filter => filter !== '')
                  ? 'No users found matching your filters'
                  : 'No users found'
                }
              </p>
            </div>
          )}
        </div>

        {/* Tablet and Desktop Table View */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {currentUsers.length > 0 ? (
              <>
                {/* Responsive Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Mobile
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                          Role
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={user.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                                alt={user.name}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover mr-3 lg:mr-4"
                                onError={(e) => {
                                  e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <div className={`font-medium  truncate ${user.is_verified ? 'text-gray-900' : 'text-gray-600'}`}>{user.name}

                                </div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <div className={`text-sm  truncate max-w-48 ${user.is_verified ? 'text-gray-900' : 'text-gray-600'}`}>{user.email}</div>
                            {/* Show mobile on tablet when mobile column is hidden */}
                            <div className="text-sm text-gray-500 lg:hidden">
                              {user.mobile || 'No mobile'}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className={`text-sm  ${user.is_verified ? 'text-gray-900' : 'text-gray-600'}`}>{user.mobile || 'N/A'}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 capitalize ${user.is_verified ? 'text-blue-800 ' : 'text-[#7476fd]'} `}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-1 lg:space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className={`p-1.5 lg:p-2  hover:bg-blue-50 rounded-lg transition-colors ${user.is_verified ? 'text-[#5356FF]' : 'text-[#7476fd]'}`}
                                aria-label="Edit user"
                              >
                                {/* <Edit className="w-4 h-4" /> */}
                                <img src={EditLogo} alt="Edit User" className={`w-4 h-4  ${user.is_verified ? 'test-[#5356FF]' : 'text-[#7476fd]'}`} />
                              </button>
                              <button
                                onClick={() => confirmDelete(user)}
                                className={`p-1.5 lg:p-2  hover:bg-red-50 rounded-lg transition-colors  ${user.is_verified ? 'text-[#FF5B5B]' : 'text-[#ff8585]'}`}
                                aria-label="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm || Object.values(columnFilters).some(filter => filter !== '')
                    ? 'No users found matching your filters'
                    : 'No users found'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                  let pageNumber;
                  const maxVisible = window.innerWidth < 640 ? 3 : 5;
                  if (totalPages <= maxVisible) {
                    pageNumber = i + 1;
                  } else if (currentPage <= Math.floor(maxVisible / 2) + 1) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                    pageNumber = totalPages - maxVisible + 1 + i;
                  } else {
                    pageNumber = currentPage - Math.floor(maxVisible / 2) + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg transition-colors ${currentPage === pageNumber
                        ? 'bg-[#5356FF] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModel isOpen={showModal}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowModal(false)}
        deleteTarget={deleteContent}
      />
    </div>
  );
};

export default UserList;
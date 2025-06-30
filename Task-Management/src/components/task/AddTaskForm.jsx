import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, getStatuses } from '../../actions/taskActions';
import { useParams } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import API from '../../services/api';

const AddTaskForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();

  const { loading, error } = useSelector((state) => state.taskOperations);
  const { user } = useSelector((state) => state.user);
  const { statuses } = useSelector((state) => state.statusList || {});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    due_date: '',
    priority: 'Medium',
    status_id: '',
    user_ids: [] // this will be set during submit
  });

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const res = await API.get(`/projects/${projectId}`, { withCredentials: true });
        const members = res.data?.project?.members || [];
        const filtered = members.filter((u) => u.id !== user?.id);
        setAllUsers(filtered);
      } catch (error) {
        console.error("Failed to fetch project members", error);
      }
    };
    fetchProjectMembers();
  }, [projectId, user?.id]);

  useEffect(() => {
    dispatch(getStatuses());
  }, [dispatch]);

  const filteredUsers = allUsers.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUsers = allUsers.filter((user) => users.includes(user.id));

  const handleUserToggle = (userId) => {
    setUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeUser = (userId) => {
    setUsers((prev) => prev.filter((id) => id !== userId));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      user_ids: users // ✅ assign selected user IDs
    };

    dispatch(createTask(projectId, dataToSubmit));
    alert('Task was added');
    onClose?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6  max-w-3xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Name *
          </label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Starting Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Status *
            </label>
            <select
              name="status_id"
              value={formData.status_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"            >
              <option value="">Select Status</option>
              {statuses?.map((status) => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Assign Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Users
          </label>

          {selectedUsers.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2">
                Selected Users ({selectedUsers.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <img
                      src={user.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                      }}
                    />
                    <span>{user.email}</span>
                    <button type="button" onClick={() => removeUser(user.id)}
                      className="text-blue-600 hover:text-blue-800">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span className="text-gray-700">
                {selectedUsers.length === 0
                  ? "Select users to assign"
                  : `${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""} selected`}
              </span>
              {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                 <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">
                      {searchTerm ? "No users found" : "No users available"}
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={users.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex items-center gap-2">
                          <img
                            src={user.profile_picture || 'http://localhost:5000/public/images/default-profile.png'}
                            alt={user.name}
                            className="w-.56 h-6.5 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'http://localhost:5000/public/images/default-profile.png';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            {user.name && <div className="text-xs text-gray-500">{user.name}</div>}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

         <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../../actions/projectActions";
import API from "../../services/api";
import { Search, X, User, ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";

export default function AddProjectForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.newProject);
  const { user } = useSelector((state) => state.user); 


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startingDate, setStartingDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  const statusOptions = [
    { value: "Backlog", label: "Backlog", color: "bg-gray-100 text-gray-800" },
    { value: "In Progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "On Hold", label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
    { value: "Completed", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const userList = Array.isArray(res.data) ? res.data : res.data.user;
        setAllUsers(userList || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users for dropdown, exclude current user (admin) from selectable list
  const filteredUsers = allUsers
    .filter((u) => u.id !== user?.id)
    .filter((u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Users selected for display (by id)
  const selectedUsers = allUsers.filter((user) => users.includes(user.id));

  // Toggle user selection
  const handleUserToggle = (userId) => {
    if (users.includes(userId)) {
      setUsers(users.filter((id) => id !== userId));
    } else {
      setUsers([...users, userId]);
    }
  };

  // Remove user from selected list
  const removeUser = (userId) => {
    setUsers(users.filter((id) => id !== userId));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Filter out admin id (current user) from user_ids before dispatching
  //   const adminId = user?.id;
  //   const filteredUserIds = users.filter(id => id !== adminId);

  //   const projectData = {
  //     title: name,
  //     description,
  //     user_ids: filteredUserIds,
  //     starting_date: startingDate,
  //     due_date: dueDate,
  //     status,
  //   };

  //   dispatch(addProject(projectData));
  //   onClose();
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  const adminId = user?.id;
  const filteredUserIds = users.filter(id => id !== adminId);

  const projectData = {
    title: name,
    description,
    user_ids: filteredUserIds,
    starting_date: startingDate,
    due_date: dueDate,
    status,
  };

  try {
    
    await dispatch(addProject(projectData));
    onClose(); // Close only if success
  } catch (error) {
    console.log("Project create error:", error);
  }
};

  // Today's date for date pickers min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6  max-w-3xl mx-auto">


      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project description"
          />
        </div>

        {/* Date Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Starting Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Starting Date *
            </label>
            <input
              required
              type="date"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar
                size={16} className="inline mr-1" />
              Due Date *
            </label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={startingDate || today}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Project Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Status *
          </label>
          <div className="flex space-x-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex flex-row items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* User Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Users
          </label>

          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2">
                Selected Users ({selectedUsers.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {/* <User size={14} /> */}
                    <img
                      src={user.profile_picture || 'DEFAULT_PROFILE_PIC'}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'DEFAULT_PROFILE_PIC';
                      }}
                    />
                    <span>{user.email}</span>
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dropdown Container */}
          <div className="relative">
            {/* Dropdown Toggle */}
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

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search users by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* User List */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-3 text-gray-500 text-center">
                      {searchTerm
                        ? "No users found matching your search"
                        : "No users available"}
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={users.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex items-center gap-3">
                          {/* <User className="text-gray-400 mr-2" size={16} /> */}
                          <img
                            src={user.profile_picture || 'DEFAULT_PROFILE_PIC'}
                            alt={user.name}
                            className="w-6.5 h-6.5 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'DEFAULT_PROFILE_PIC';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            {user.name && (
                              <div className="text-xs text-gray-500">{user.name}</div>
                            )}
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

        {/* Action Buttons */}
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
            {loading ? "Adding..." : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

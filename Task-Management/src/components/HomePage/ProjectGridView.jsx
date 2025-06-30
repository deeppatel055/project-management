import { Calendar, Users, Tag, User,  Edit,  MoreVertical, Trash2 } from 'lucide-react';
import { getStatusColor, getStatusIcon } from './utils';
import { useEffect, useState, useRef } from 'react';

const ProjectGridView = ({  project, onEdit, onDelete, navigateTo, userTasks  }) => {
  const [createdBy, setCreatedBy] = useState('Unassigned');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (project && project.members) {
      const creator = project.members.find(user => user.id === project.created_by);
      setCreatedBy(creator?.name || 'Not Available');
    }
  }, [project]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(project);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    onDelete(project); // This triggers confirmDelete in HomePage
  };

  return (
    <div
      onClick={() => navigateTo(project.id)}
      className="bg-white rounded-xl hover: transition duration-300 cursor-pointer transform hover:shadow-xl relative"
    >
      <div className="p-6">
        <div className="flex justify-between items-start ">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {project.title || 'Untitled Project'}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {project.description || 'No description available'}
            </p>
          </div>

          {/* Three-dot menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="p-1 text-gray-400 hover:text-gray-600 "
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200"></div>

        <div className="flex justify-between items-center mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1">{project.status || 'No Status'}</span>
          </span>
        </div>

        <div className="space-y-3">

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
            </div>

            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              {userTasks?.length || 0} tasks
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {project.members?.length || 0} members
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{createdBy || 'Unassigned'}</span>
            </div>

          </div>
        </div>


      </div>
    </div>
  );
};

export default ProjectGridView;
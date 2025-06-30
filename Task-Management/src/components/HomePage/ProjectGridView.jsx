import { Calendar, Users, Tag, User, Eye, Edit, Target } from 'lucide-react';
import { getStatusColor, getStatusIcon } from './utils';
import { useEffect, useState } from 'react';

const ProjectGridView = ({ project, onView, onEdit, navigateTo, userTasks }) => {
  const [createdBy, setCreatedBy] = useState('Unassigned');

  useEffect(() => {
    if (project && project.members) {
      const creator = project.members.find(user => user.id === project.created_by);
      setCreatedBy(creator?.name || 'Not Available');
    }
  }, [project]);


  return (
    <div
      onClick={() => navigateTo(project.id)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {project.title || 'Untitled Project'}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {project.description || 'No description available'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1">{project.status || 'No Status'}</span>
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {project.members?.length || 0} members
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              {userTasks?.length || 0} tasks
            </div>
          </div>

         
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{createdBy || 'Unassigned'}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onView(project); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGridView;

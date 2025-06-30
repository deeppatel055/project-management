import { Calendar, Users, Tag, User, Eye, Edit, Target } from 'lucide-react';
import { getStatusColor, getStatusIcon } from './utils';

const ProjectListView = ({ project, onView, onEdit, navigateTo, userTasks }) => {

  return (
    <div
      onClick={() => navigateTo(project.id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title || 'Untitled Project'}</h3>
                <p className="text-gray-600 text-sm truncate mt-1">{project.description || 'No description available'}</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status || 'No Status'}</span>
                </span>

               

                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {project.members?.length || 0}
                </div>

                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {userTasks?.length || 0} tasks
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button onClick={(e) => { e.stopPropagation(); onView(project); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {project.progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListView;

import { Target, Plus, CheckCircle } from 'lucide-react';

const EmptyState = ({ searchTerm, tab = 'projects' }) => {
  const isProjectTab = tab === 'projects';

  return (
    <div className="col-span-full text-center py-12">
      <div className="text-gray-400 mb-4">
        {isProjectTab ? <Target className="w-16 h-16 mx-auto" /> : <CheckCircle className="w-16 h-16 mx-auto" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isProjectTab ? 'No projects found' : 'Tasks View'}
      </h3>
      <p className="text-gray-600 mb-4">
        {isProjectTab
          ? searchTerm
            ? 'Try adjusting your search terms'
            : 'Get started by creating your first project'
          : 'Task management functionality coming soon...'}
      </p>
      {isProjectTab && (
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </button>
      )}
    </div>
  );
};

export default EmptyState;

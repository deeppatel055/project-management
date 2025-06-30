import { Grid3X3, List } from 'lucide-react';
import { PROJECT_STATUSES, getStatusIcon } from './utils';

const ProjectFilterBar = ({ projectFilter, setProjectFilter, viewMode, setViewMode }) => (
  <div className="mb-6 flex flex-wrap justify-between gap-2 items-center">
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setProjectFilter('all')}
        className={`px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2 ${
          projectFilter === 'all'
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200'
        }`}
      >
        <span>All Projects</span>
      </button>
      {PROJECT_STATUSES.map((status) => (
        <button
          key={status.value}
          onClick={() => setProjectFilter(status.value)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition ${
            projectFilter === status.value
              ? `scale-105 ring-2 ring-offset-1 ${status.color}`
              : `${status.color} hover:opacity-90`
          }`}
        >
          {getStatusIcon(status.value)}
          <span>{status.label}</span>
        </button>
      ))}
    </div>

    <div className="flex items-center space-x-2 bg-white/50 p-1 rounded-lg">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-white'}`}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-white'}`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default ProjectFilterBar;

import { useState } from 'react';
import { PROJECT_STATUSES } from './utils';
import GridListView from './GridListView';
import StatusBadge from './../StatusBadge';

const ProjectFilterBar = ({ projectFilter, setProjectFilter, viewMode, setViewMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getFilterLabel = () => {
    if (projectFilter === 'all') return 'All Projects';
    const status = PROJECT_STATUSES.find(s => s.value === projectFilter);
    return status ? status.label || status.value : 'All Projects';
  };

  const handleStatusSelect = (statusValue) => {
    setProjectFilter(statusValue);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mb-6 flex flex-wrap justify-between gap-2 items-center">
      <div className="flex flex-wrap gap-2">
        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2 border ${
              projectFilter !== 'all'
                ? 'bg-[#5356FF] text-white shadow-lg scale-105 border-blue-600'
                : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 border-gray-200'
            }`}
          >
            <span>{getFilterLabel()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                {/* All Projects Option */}
                <button
                  onClick={() => handleStatusSelect('all')}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                    projectFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>All Projects</span>
                </button>
                
                {/* Status Options */}
                {PROJECT_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusSelect(status.value)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                      projectFilter === status.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <StatusBadge
                      status={status.value}
                      withBorder
                      className="text-sm"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <GridListView viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default ProjectFilterBar;
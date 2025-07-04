// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// import { getStatuses } from '../../actions/taskActions';
// import GridListView from './GridListView';
// import StatusBadge from './../StatusBadge';

// const TaskFilterBar = ({ taskFilter, setTaskFilter, viewMode, setViewMode }) => {
//   const dispatch = useDispatch();
//   const { statuses } = useSelector((state) => state.statusList);

//   useEffect(() => {
//     dispatch(getStatuses());
//   }, [dispatch]);

//   return (
//     <div className="mb-6 flex flex-wrap justify-between gap-2 items-center">
//       {/* Left: Status Filters */}
//       <div className="flex flex-wrap gap-2">
//         <button
//           onClick={() => setTaskFilter('all')}
//           className={`px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2 ${
//             taskFilter === 'all'
//               ? 'bg-blue-600 text-white shadow-lg scale-105'
//               : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200'
//           }`}
//         >
//           <span>All Tasks</span>
//         </button>

//         {(statuses || []).map((status) => {
//           const statusValue = status.name || status.value || status.label || '';
//           return (
//             <button
//               key={status.id || statusValue}
//               onClick={() => setTaskFilter(statusValue)}
//               className={`transition ${taskFilter === statusValue ? 'scale-105 ring-2 ring-offset-1' : ''}`}
//             >
//               <StatusBadge
//                 status={statusValue}
//                 withBorder
//                 className="text-sm"
//               />
//             </button>
//           );
//         })}
//       </div>

//       {/* Right: Grid/List toggle */}
//       <GridListView viewMode={viewMode} setViewMode={setViewMode} />
//     </div>
//   );
// };

// export default TaskFilterBar;



import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getStatuses } from '../../actions/taskActions';
import GridListView from './GridListView';
import StatusBadge from './../StatusBadge';

const TaskFilterBar = ({ taskFilter, setTaskFilter, viewMode, setViewMode }) => {
  const dispatch = useDispatch();
  const { statuses } = useSelector((state) => state.statusList);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(getStatuses());
  }, [dispatch]);

  const getFilterLabel = () => {
    if (taskFilter === 'all') return 'All Tasks';
    const status = (statuses || []).find(s => {
      const statusValue = s.name || s.value || s.label || '';
      return statusValue === taskFilter;
    });
    return status ? (status.name || status.value || status.label || 'All Tasks') : 'All Tasks';
  };

  const handleStatusSelect = (statusValue) => {
    setTaskFilter(statusValue);
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
              taskFilter !== 'all'
                ? 'bg-blue-600 text-white shadow-lg scale-105 border-blue-600'
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
                {/* All Tasks Option */}
                <button
                  onClick={() => handleStatusSelect('all')}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                    taskFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>All Tasks</span>
                </button>
                
                {/* Status Options */}
                {(statuses || []).map((status) => {
                  const statusValue = status.name || status.value || status.label || '';
                  return (
                    <button
                      key={status.id || statusValue}
                      onClick={() => handleStatusSelect(statusValue)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                        taskFilter === statusValue ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <StatusBadge
                        status={statusValue}
                        withBorder
                        className="text-sm"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Grid/List toggle */}
      <GridListView viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default TaskFilterBar;
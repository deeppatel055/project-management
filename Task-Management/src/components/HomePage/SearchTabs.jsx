import { Search } from 'lucide-react';

const SearchTabs = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mb-6">
    {/* Search Input */}
    <div className="relative w-full sm:w-[60%] lg:w-[50%]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
      <input
        type="text"
        placeholder="Search projects and tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
    
    {/* Tab Buttons */}
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:w-[30%] flex bg-gray-100/50 p-1 rounded-xl backdrop-blur-sm">
      {['projects', 'tasks'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
            activeTab === tab 
              ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

export default SearchTabs;
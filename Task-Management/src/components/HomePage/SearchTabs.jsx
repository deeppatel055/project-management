import { Search } from 'lucide-react';

const SearchTabs = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => (
  <div className="flex justify-between mb-6">
    <div className="relative w-[50%]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search projects and tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="w-[30%] flex bg-gray-100/50 p-1 rounded-xl backdrop-blur-sm">
      {['projects', 'tasks'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
            activeTab === tab ? 'bg-white text-blue-600 shadow-lg transform scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

export default SearchTabs;

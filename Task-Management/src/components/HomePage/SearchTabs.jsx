import { Box, Typography, styled } from '@mui/material';
import { Search } from 'lucide-react';

const ToggleContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'inline-flex',
  backgroundColor: '#E6E6E6',
  borderRadius: '25px',
  padding: '4px',
  cursor: 'pointer',
  minWidth: '200px',
  height: '50px',
  transition: 'box-shadow 0.3s ease',

}));

const ToggleOption = styled(Box)(({ active }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '21px',
  padding: '8px 16px',
  zIndex: 2,
  transition: 'all 0.3s ease',
  '& .MuiTypography-root': {
    fontWeight: active ? 600 : 400,
    color: active ? '#000' : '#000',
    transition: 'color 0.3s ease',
  },
}));

const ToggleSlider = styled(Box)(({ position }) => ({
  position: 'absolute',
  top: '4px',
  left: position === 'left' ? '4px' : '50%',
  width: 'calc(50% - 4px)',
  height: 'calc(100% - 8px)',
  backgroundColor: '#fff',
  borderRadius: '21px',
  transition: 'left 0.3s ease',
  zIndex: 1,
}));

const SearchTabs = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => {
  const handleToggle = () => {
    const newTab = activeTab === 'projects' ? 'tasks' : 'projects';
    setActiveTab(newTab);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">

        <div className="relative w-full sm:w-[60%] lg:w-[50%] flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects and tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg  focus:ring-1 focus:ring-[#5356FF] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="w-full sm:w-auto flex bg-gray-100/50 p-1 rounded-xl backdrop-blur-sm">
          <ToggleContainer onClick={handleToggle}>
            <ToggleSlider position={activeTab === 'projects' ? 'left' : 'right'} />

            <ToggleOption active={activeTab === 'projects'}>
              <Typography variant="body1">Project</Typography>
            </ToggleOption>

            <ToggleOption active={activeTab === 'tasks'}>
              <Typography variant="body1">Task</Typography>
            </ToggleOption>
          </ToggleContainer>
        </div>

      </div>
    </div>
  );
};

export default SearchTabs;

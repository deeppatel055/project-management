import { Grid3X3, List } from 'lucide-react'

const GridListView = ({setViewMode, viewMode}) => {
    return (
        <div className="flex items-center space-x-2 bg-[#E6E6E6] p-1 rounded-lg cursor-pointer">
            <button
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white  text-gray-600' : 'text-gray-600'}`}
            >
                <Grid3X3 className="w-4 h-4" />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={` cursor-pointer p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white text-gray-600' : 'text-gray-600'}`}
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    )
}

export default GridListView
const Loading = ({ sidebarOpen = false, isMobile = false }) => {

    return (
        <div className={`transition-all duration-300 min-h-screen ${sidebarOpen && !isMobile ? 'ml-64 lg:ml-72' : 'ml-0'}`}>
            <div className="pt-20 p-4 sm:p-6 lg:p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5356FF]"></div>
            </div>
        </div>
    );
}

export default Loading  
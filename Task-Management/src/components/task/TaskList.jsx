import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';

const TaskList = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Filter and sort states
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const { tasks } = useSelector((state) => state.tasks);

    const handleAddTask = () => {
        navigate(`/projects/${id}/add-task`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get task status color
    const getTaskStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending': return 'bg-red-100 text-red-800 border-red-200';
            case 'on hold': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get unique statuses from tasks
    const availableStatuses = useMemo(() => {
        if (!tasks || tasks.length === 0) return [];
        const statuses = [...new Set(tasks.map(task => task.status).filter(Boolean))];
        return statuses.map(status => ({
            value: status.toLowerCase(),
            label: status
        }));
    }, [tasks]);

    // Filter and sort tasks
    const filteredAndSortedTasks = useMemo(() => {
        if (!tasks) return [];

        let filtered = tasks.filter(task => {
            // Status filter
            const statusMatch = statusFilter === 'all' ||
                task.status?.toLowerCase() === statusFilter;

            // Search filter
            const searchMatch = searchQuery === '' ||
                task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });

        // Sort tasks
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at || b.starting_date || 0) - new Date(a.created_at || a.starting_date || 0);
                case 'oldest':
                    return new Date(a.created_at || a.starting_date || 0) - new Date(b.created_at || b.starting_date || 0);
                case 'due_date': {

                    const dueDateA = new Date(a.due_date || a.end_date || '9999-12-31');
                    const dueDateB = new Date(b.due_date || b.end_date || '9999-12-31');
                    return dueDateA - dueDateB;
                }
                case 'priority':{

                    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    return (priorityOrder[b.priority?.toLowerCase()] || 0) -
                    (priorityOrder[a.priority?.toLowerCase()] || 0);
                }
                case 'alphabetical':
                    return (a.title || a.name || '').localeCompare(b.title || b.name || '');
                default:
                    return 0;
            }
        });

        return filtered;
    }, [tasks, statusFilter, sortBy, searchQuery]);

    const clearFilters = () => {
        setStatusFilter('all');
        setSortBy('newest');
        setSearchQuery('');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                   
                    <h3 className="text-xl font-bold text-gray-800">Project Tasks</h3>
                    <span className="px-3 py-1 bg-[#f5f5f5] text-black rounded-full text-sm font-medium">
                        {filteredAndSortedTasks?.length || 0} / {tasks?.length || 0} tasks
                    </span>
                </div>
                <button
                    onClick={handleAddTask}
                    className="px-6 py-3 bg-[#5356FF] text-white rounded-xl font-medium transition-all duration-200 hover:scale-101 flex items-center gap-2 shadow-lg"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                </button>
            </div>

            {/* Filters and Search */}
            {tasks && tasks.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5356FF] focus:border-transparent outline-none transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="lg:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5356FF] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="all">All Status</option>
                                {availableStatuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="lg:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5356FF] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="due_date">Due Date</option>
                                <option value="priority">Priority</option>
                                <option value="alphabetical">A-Z</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {(statusFilter !== 'all' || sortBy !== 'newest' || searchQuery !== '') && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLineCap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Active Filters Summary */}
                    {(statusFilter !== 'all' || searchQuery !== '') && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            {statusFilter !== 'all' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Status: {availableStatuses.find(s => s.value === statusFilter)?.label}
                                </span>
                            )}
                            {searchQuery && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                    Search: "{searchQuery}"
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Tasks List */}
            {tasks && tasks.length > 0 ? (
                filteredAndSortedTasks.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAndSortedTasks.map((task, index) => (
                            <NavLink
                                to={`/projects/${task.project_id}/tasks/${task.id}`}
                                key={task.id || index}
                                className="block bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-[#5356FF] transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800 group-hover:text-[#5356FF] transition-colors">
                                                {task.title || task.name || 'Untitled Task'}
                                            </h4>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTaskStatusColor(task.status)}`}>
                                                    {task.status || 'Not Set'}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority || 'Normal'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {task.description || 'No description provided'}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Start: {formatDate(task.starting_date || task.start_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Due: {formatDate(task.due_date || task.end_date)}</span>
                                            </div>
                                            {task.assigned_to && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>Assigned to: {task.assigned_to}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#5356FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                ) : (
                    // No tasks match filters
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-4">No tasks match your filters</p>
                        <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Filters
                        </button>
                    </div>
                )
            ) : (
                // No tasks created yet
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">No tasks created yet</p>
                   
                </div>
            )}
        </div>
    )
}

export default TaskList
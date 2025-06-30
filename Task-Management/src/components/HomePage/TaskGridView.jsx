import { Calendar, Users, User, Eye, Edit, MoreVertical, Trash2 } from "lucide-react";
import { getTaskStatusColor, getTaskStatusIcon } from "./utils";
import { useEffect, useRef, useState } from "react";

const TaskGridView = ({ task, navigateTo, onDelete, onEdit }) => {

    const [createdBy, setCreatedBy] = useState('Unassigned');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (task && task.assigned_members) {
            console.log('task.assigned_members', task.assigned_members);

            const creator = task?.assigned_members?.find(user => user.id == task.user_id);
            console.log('creator', creator);

            setCreatedBy(creator?.name || 'Not Available');
        }
    }, [task]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleDropdownToggle = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };
    const handleEdit = (e) => {
        console.log('edit click');

        e.stopPropagation();
        setShowDropdown(false);
        onEdit(task); ``
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDropdown(false);
        onDelete(task);
    }

    return (
        <div
            onClick={() => navigateTo(task.id)}
            className="bg-white rounded-xl hover: transition duration-300 cursor-pointer transform hover:shadow-xl relative"
        >

            <div className="p-6">
                <div className="flex justify-between items-start ">
                    <div className="flex-1 pr-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {task.title || 'Untitled Project'}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {task.description || 'No description available'}
                        </p>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleDropdownToggle}
                            className="p-1 text-gray-400 hover:text-gray-600 "
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-200"></div>

                <div className="flex gap-1 items-center mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusIcon(task.status)}
                        <span className="ml-1">{task.status || 'No Status'}</span>
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusIcon(task.status)}
                        <span className="ml-1">{task.priority || 'No Priority'}</span>
                    </span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {task.assigned_members?.length || 0} members
                        </div>
                        <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{createdBy || 'Unassigned'}</span>
                        </div>
                    </div>


                </div>


            </div>
        </div>
    )
}

export default TaskGridView
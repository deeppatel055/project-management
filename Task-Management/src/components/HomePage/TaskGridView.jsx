import { Calendar, Users, User, Eye, Edit } from "lucide-react";
import { getTaskStatusColor, getTaskStatusIcon } from "./utils";
import { useEffect, useState } from "react";

const TaskGridView = ({ task, navigateTo, onView, onEdit }) => {

    console.log('task', task);
     const [createdBy, setCreatedBy] = useState('Unassigned');
    console.log('createdBy', createdBy);
    console.log('createdBy', task.user_id);
    
     useEffect(() => {
       if (task && task.assigned_members) {
        console.log('task.assigned_members', task.assigned_members);
        
         const creator = task?.assigned_members?.find(user => user.id == task.user_id);
         console.log('creator', creator);
         
         setCreatedBy(creator?.name || 'Not Available');
       }
     }, [task]);

    return (
        <div
            onClick={() => navigateTo(task.id)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
        >

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {task.title || 'Untitled Project'}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {task.description || 'No description available'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {getTaskStatusIcon(task.status)}
                        <span className="ml-1">{task.status || 'No Status'}</span>
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

                    </div>


                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{createdBy || 'Unassigned'}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); onView(task); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TaskGridView
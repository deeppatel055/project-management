import { Calendar, Users, User, Eye, Edit } from "lucide-react";
import { getTaskStatusColor, getTaskStatusIcon } from "./utils";
import { useEffect, useState } from 'react';

const TaskListView = ({task, navigateTo, onView, onEdit  }) => {
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
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title || 'Untitled task'}</h3>
                <p className="text-gray-600 text-sm truncate mt-1">{task.description || 'No description available'}</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                  {getTaskStatusIcon(task.status)}
                  <span className="ml-1">{task.status || 'No Status'}</span>
                </span>

               

                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {task.members?.length || 0}
                </div>

             

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
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
  );
};

export default TaskListView;

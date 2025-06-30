import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export const PROJECT_STATUSES = [
  { value: 'Backlog', label: 'Backlog', color: 'bg-gray-100 text-gray-800' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'On Hold', label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const getStatusIcon = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (s === 'in progress' || s === 'in-progress') return <Clock className="w-4 h-4 text-blue-500" />;
  if (s === 'on hold' || s === 'pending') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  if (s === 'cancelled' || s === 'overdue') return <XCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-gray-500" />;
};

export const getStatusColor = (status) => {
  const found = PROJECT_STATUSES.find((s) => s.value === status);
  return found ? found.color : 'bg-gray-100 text-gray-800';
};

export const filterProjects = (projects, filter, searchTerm) => {
  return projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
};


export const getTaskStatusIcon = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (s === 'in progress' || s === 'in-progress') return <Clock className="w-4 h-4 text-blue-500" />;
  if (s === 'on hold' || s === 'pending') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  if (s === 'cancelled' || s === 'overdue') return <XCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-gray-500" />;
};

export const getTaskStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed') return 'bg-green-100 text-green-800';
  if (s === 'in progress' || s === 'in-progress') return 'bg-blue-100 text-blue-800';
  if (s === 'on hold' || s === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (s === 'cancelled' || s === 'overdue') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export const filterTasks = (tasks, filter, searchTerm) => {
  return tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
};

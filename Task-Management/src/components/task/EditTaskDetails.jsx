import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllUsers } from '../../actions/userActions';
import {
  getStatuses,
  getTaskDetail,
  updateTask,
} from '../../actions/taskActions';
import Loading from '../common/Loading';

const EditTaskDetails = () => {
  const { task_id, project_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers || {}
  );
  const { statuses, loading: statusesLoading } = useSelector(
    (state) => state.statusList || {}
  );
  const { task, loading: taskLoading } = useSelector(
    (state) => state.taskDetail || {}
  );

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    start_date: '',
    due_date: '',
    priority: 'Medium',
    status_id: '',
    user_ids: [],
  });

  // Initial data fetch
  useEffect(() => {
    if (!task?.id) dispatch(getTaskDetail(task_id));
    if (!users?.length) dispatch(getAllUsers());
    if (!statuses?.length) dispatch(getStatuses());
  }, [dispatch, task_id, task?.id, users?.length, statuses?.length]);

  // Populate form once task and users are loaded
  useEffect(() => {
    if (!task?.id || users.length === 0) return;

    const assignedUserIds = Array.isArray(task.assigned_members)
      ? task.assigned_members.map((u) => u.id)
      : [];

    setForm({
      title: task.title || '',
      description: task.description || '',
      start_date: task.start_date?.slice(0, 10) || '',
      due_date: task.due_date?.slice(0, 10) || '',
      priority: task.priority || 'Medium',
      status_id: task.status_id?.toString() || '',
      user_ids: assignedUserIds,
    });

    setLoading(false);
  }, [task, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserToggle = (userId) => {
    setForm((prev) => ({
      ...prev,
      user_ids: prev.user_ids.includes(userId)
        ? prev.user_ids.filter((id) => id !== userId)
        : [...prev.user_ids, userId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTask(task_id, form));
    navigate(`/projects/${project_id}/tasks/${task_id}`);
  };

  if (loading || taskLoading || usersLoading || statusesLoading) {
    return <Loading />;
  }

  if (!task?.id && !taskLoading) {
    return (
      <div className="p-6 text-red-500">
        Task not found. Please check the URL or try again later.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Priority *
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Status *
            </label>
            <select
              name="status_id"
              value={form.status_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              {statuses?.map((status) => (
                <option key={status.id} value={status.id.toString()}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Users
          </label>
          <div className="flex flex-wrap gap-2">
            {users.length ? (
              users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 text-sm border px-3 py-1 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.user_ids.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  {user.name}
                </label>
              ))
            ) : (
              <div className="text-gray-500">No users available</div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskDetails;

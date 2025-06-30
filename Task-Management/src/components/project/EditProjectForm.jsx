// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllProjects, updateProject } from '../../actions/projectActions';
// import { getAllUsers } from '../../actions/userActions';
// import { Calendar, Loader } from 'lucide-react';

// const ProjectEditPage = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { users } = useSelector(state => state.allUsers);
//   const { projects = [] } = useSelector(state => state.projects || {});
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     due_date: '',
//     starting_date: '',
//     status: 'Backlog',
//     user_ids: [],
//   });

//   const statusOptions = [
//     { value: "Backlog", label: "Backlog", color: "bg-gray-100 text-gray-800" },
//     { value: "In Progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
//     { value: "On Hold", label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
//     { value: "Completed", label: "Completed", color: "bg-green-100 text-green-800" },
//     { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
//   ];

//   useEffect(() => {
//     dispatch(getAllUsers());
//     dispatch(getAllProjects());
//   }, [dispatch]);
// useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await API.get("/users");
//         const userList = Array.isArray(res.data) ? res.data : res.data.user;
//         setAllUsers(userList || []);
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (!projects.length) return;

    
//     const projectToEdit = projects.find(p => Number(p.id) === Number(id));
//     if (projectToEdit) {
//       setForm({
//         title: projectToEdit.title || '',
//         description: projectToEdit.description || '',
//         due_date: projectToEdit.due_date?.slice(0, 10) || '',
//         starting_date: projectToEdit.starting_date?.slice(0, 10) || '',
//         status: projectToEdit.status || 'Backlog',
//         user_ids: projectToEdit.members?.map(u => u.id) || [],
//       });
//     }
//     setLoading(false);
//   }, [projects, id]);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleUserToggle = userId => {
//     setForm(prev => ({
//       ...prev,
//       user_ids: prev.user_ids.includes(userId)
//         ? prev.user_ids.filter(id => id !== userId)
//         : [...prev.user_ids, userId],
//     }));
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     dispatch(updateProject(id, form));
//     navigate(`/projects/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center gap-2 text-gray-600">
//         Loading project... <Loader className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Project</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Project Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="Enter project title"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             rows={4}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="Enter project description"
//           />
//         </div>

//         {/* Dates */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date *</label>
//             <input
//               type="date"
//               name="starting_date"
//               value={form.starting_date}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
//             <input
//               type="date"
//               name="due_date"
//               value={form.due_date}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Project Status *</label>
//           <div className="flex flex-wrap gap-3">
//             {statusOptions.map(option => (
//               <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="status"
//                   value={option.value}
//                   checked={form.status === option.value}
//                   onChange={handleChange}
//                   className="text-blue-600"
//                 />
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
//                   {option.label}
//                 </span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Assign Users */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Assign Users</label>
//           <div className="flex flex-wrap gap-2">
//             {users.length ? (
//               users.map(user => (
//                 <label
//                   key={user.id}
//                   className="flex items-center gap-2 text-sm border px-3 py-1 rounded-md cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={form.user_ids.includes(user.id)}
//                     onChange={() => handleUserToggle(user.id)}
//                   />
//                   {user.name}
//                 </label>
//               ))
//             ) : (
//               <div className="text-gray-500">No users available</div>
//             )}
//           </div>
//         </div>

//         {/* Submit */}
//         <div>
//           <button
            
//             className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
//           >
//             Update Project
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectEditPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects, updateProject } from '../../actions/projectActions';
import { getAllUsers } from '../../actions/userActions';
import { Loader } from 'lucide-react';

const ProjectEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users = [] } = useSelector(state => state.allUsers);
  const { projects = [] } = useSelector(state => state.projects || {});
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    starting_date: '',
    status: 'Backlog',
    user_ids: [],
  });

  const statusOptions = [
    { value: "Backlog", label: "Backlog", color: "bg-gray-100 text-gray-800" },
    { value: "In Progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "On Hold", label: "On Hold", color: "bg-yellow-100 text-yellow-800" },
    { value: "Completed", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
  ];

  // Load users and projects
  useEffect(() => {
    if (!users.length) dispatch(getAllUsers());
    if (!projects.length) dispatch(getAllProjects());
  }, [dispatch, users.length, projects.length]);

  // Set form once data is loaded
  useEffect(() => {
    if (!users.length || !projects.length) return;

    const projectToEdit = projects.find(p => Number(p.id) === Number(id));
    if (projectToEdit) {
      setForm({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        due_date: projectToEdit.due_date?.slice(0, 10) || '',
        starting_date: projectToEdit.starting_date?.slice(0, 10) || '',
        status: projectToEdit.status || 'Backlog',
        user_ids: projectToEdit.members?.map(u => u.id) || [],
      });
      setLoading(false);
    }
  }, [projects, users, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserToggle = userId => {
    setForm(prev => ({
      ...prev,
      user_ids: prev.user_ids.includes(userId)
        ? prev.user_ids.filter(id => id !== userId)
        : [...prev.user_ids, userId],
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateProject(id, form));
    navigate(`/projects/${id}`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-gray-600">
        Loading project... <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter project description"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date *</label>
            <input
              type="date"
              name="starting_date"
              value={form.starting_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Status *</label>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={form.status === option.value}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Assign Users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign Users</label>
          <div className="flex flex-wrap gap-2">
            {users.length ? (
              users.map(user => (
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

        {/* Submit */}
        <div>
          <button
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Update Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditPage;

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import SearchTabs from "../components/HomePage/SearchTabs";
// import ProjectFilterBar from "../components/HomePage/ProjectFilterBar";
// import ProjectGridView from "../components/HomePage/ProjectGridView";
// import ProjectListView from "../components/HomePage/ProjectListView";
// import TaskGridView from "../components/HomePage/TaskGridView";
// import TaskListView from "../components/HomePage/TaskListView";
// import EmptyState from "../components/HomePage/EmptyState";
// import { filterProjects } from "../components/HomePage/utils";

// import { deleteProject } from "../actions/projectActions";

// import { deleteTask, getTasksByUser } from "../actions/taskActions";
// import DeleteModel from "../components/models/DeleteModel";

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("projects");
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState("grid");

//   const { projects = [] } = useSelector((state) => state.projects);
//   const { tasks: userTasks = [] } = useSelector((state) => state.userTasks);
//   const [deleteContent, setDeleteContent] = useState('');
//   const [projectToDelete, setProjectToDelete] = useState(null);
//   const [taskToDelete, setTaskToDelete] = useState(null);

//   const [showModal, setShowModal] = useState(false);

//   console.log('tasks', userTasks);
  

//   useEffect(() => {
//     dispatch(getTasksByUser());
//   }, [dispatch]);

//   const navigateToProject = (projectId) => {
//     navigate(`/projects/${projectId}`);
//   };
//   const navigateToTask = (taskId) => {
//     navigate(`/projects/${userTasks.project_id}/tasks/${taskId}`);
//   };
//   const filteredProjects = filterProjects(projects, projectFilter, searchTerm);

//   const handleEditTask = (taskId) => {
//     navigate(`/projects/${userTasks.project_id}/tasks/${taskId}/edit`)
//   }

//   const handleEditProject = (project) => {
//     navigate(`/projects/${project.id}/edit`);
//   }


//   const confirmDelete = (project) => {
//     setDeleteContent(`Project "${project.title}"`);
//     setProjectToDelete(project);
//     setShowModal(true);
//   };
//   const confirmDeleteTask = (task) => {
//     setDeleteContent(`Task "${task.title}"`);
//     setTaskToDelete(task);
//     setShowModal(true);
//   };

//   // Handle delete project with loading state
//   const handleDelete = async () => {
//     try {
//       if (projectToDelete) {
//         await dispatch(deleteProject(projectToDelete.id));
//       } else if (taskToDelete) {
//         await dispatch(deleteTask(taskToDelete.id));
//         await dispatch(getTasksByUser());
//       }

//       setShowModal(false);
//       setProjectToDelete(null);
//       setTaskToDelete(null);
//       setDeleteContent('');
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setShowModal(false);
//     }
//   };


//   const renderProjects = () => {
//     if (!filteredProjects.length) return <EmptyState tab="projects" searchTerm={searchTerm} />;

//     return (
//       <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}>
//         {filteredProjects.map((project) => {
//           const tasksForProject = userTasks.filter(task => task.project_id === project.id);

//           return viewMode === 'grid' ? (
//             <ProjectGridView
//               key={project.id}
//               project={project}
//               userTasks={tasksForProject}
//               onEdit={handleEditProject}
//               navigateTo={navigateToProject}
//               onDelete={confirmDelete} // 
//             />
//           ) : (
//             <ProjectListView
//               key={project.id}
//               project={project}
//               userTasks={tasksForProject}
//               onEdit={handleEditProject}
//               navigateTo={navigateToProject}
//               onDelete={confirmDelete} // 
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   const renderTasks = () => {
//     if (!userTasks.length) return <EmptyState tab="tasks" searchTerm={searchTerm} />;

//     return (
//       <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}>
//         {userTasks.map((task) =>
//           viewMode === 'grid' ? (
//             <TaskGridView key={task.id} task={task} navigateTo={navigateToTask} onEdit={handleEditTask} onDelete={confirmDeleteTask} />
//           ) : (
//             <TaskListView key={task.id} task={task} navigateTo={navigateToTask} onEdit={handleEditTask} onDelete={confirmDeleteTask} />
//           )
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-0 lg:pr-10">
//       <SearchTabs
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//       />

//       <ProjectFilterBar
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//         projectFilter={activeTab === 'projects' ? projectFilter : undefined}
//         setProjectFilter={activeTab === 'projects' ? setProjectFilter : undefined}
//       />

//       {activeTab === "projects" ? renderProjects() : renderTasks()}

//       <DeleteModel
//         isOpen={showModal}
//         onConfirm={handleDelete}
//         onCancel={() => setShowModal(false)}
//         deleteTarget={deleteContent}
//       />
//     </div>
//   );
// };

// export default HomePage;


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SearchTabs from "../components/HomePage/SearchTabs";
import ProjectFilterBar from "../components/HomePage/ProjectFilterBar";
import TaskFilterBar from "../components/HomePage/TaskFilterBar"; // ✅ added
import ProjectGridView from "../components/HomePage/ProjectGridView";
import ProjectListView from "../components/HomePage/ProjectListView";
import TaskGridView from "../components/HomePage/TaskGridView";
import TaskListView from "../components/HomePage/TaskListView";
import EmptyState from "../components/HomePage/EmptyState";
import DeleteModel from "../components/models/DeleteModel";

import { filterProjects } from "../components/HomePage/utils";
import { deleteProject } from "../actions/projectActions";
import { deleteTask, getTasksByUser } from "../actions/taskActions";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("projects");
  const [projectFilter, setProjectFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all"); // ✅ added for task status filter
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { projects = [] } = useSelector((state) => state.projects);
  const { tasks: userTasks = [] } = useSelector((state) => state.userTasks);

  const [deleteContent, setDeleteContent] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getTasksByUser());
  }, [dispatch]);

  const navigateToProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const navigateToTask = (taskId) => {
    const projectId = userTasks.find(t => t.id === taskId)?.project_id;
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  const handleEditTask = (taskId) => {
    const projectId = userTasks.find(t => t.id === taskId)?.project_id;
    navigate(`/projects/${projectId}/tasks/${taskId}/edit`);
  };

  const handleEditProject = (project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  const confirmDelete = (project) => {
    setDeleteContent(`Project "${project.title}"`);
    setProjectToDelete(project);
    setShowModal(true);
  };

  const confirmDeleteTask = (task) => {
    setDeleteContent(`Task "${task.title}"`);
    setTaskToDelete(task);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      if (projectToDelete) {
        await dispatch(deleteProject(projectToDelete.id));
      } else if (taskToDelete) {
        await dispatch(deleteTask(taskToDelete.id));
        await dispatch(getTasksByUser());
      }

      setShowModal(false);
      setProjectToDelete(null);
      setTaskToDelete(null);
      setDeleteContent('');
    } catch (error) {
      console.error("Delete failed:", error);
      setShowModal(false);
    }
  };

  const filteredProjects = filterProjects(projects, projectFilter, searchTerm);

  const filteredTasks = taskFilter === 'all'
    ? userTasks
    : userTasks.filter(task => task.status?.toLowerCase() === taskFilter.toLowerCase());

  const renderProjects = () => {
    if (!filteredProjects.length) return <EmptyState tab="projects" searchTerm={searchTerm} />;

    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}>
        {filteredProjects.map((project) => {
          const tasksForProject = userTasks.filter(task => task.project_id === project.id);

          return viewMode === 'grid' ? (
            <ProjectGridView
              key={project.id}
              project={project}
              userTasks={tasksForProject}
              onEdit={handleEditProject}
              navigateTo={navigateToProject}
              onDelete={confirmDelete}
            />
          ) : (
            <ProjectListView
              key={project.id}
              project={project}
              userTasks={tasksForProject}
              onEdit={handleEditProject}
              navigateTo={navigateToProject}
              onDelete={confirmDelete}
            />
          );
        })}
      </div>
    );
  };

  const renderTasks = () => {
    if (!filteredTasks.length) return <EmptyState tab="tasks" searchTerm={searchTerm} />;

    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}>
        {filteredTasks.map((task) =>
          viewMode === 'grid' ? (
            <TaskGridView
              key={task.id}
              task={task}
              navigateTo={navigateToTask}
              onEdit={handleEditTask}
              onDelete={confirmDeleteTask}
            />
          ) : (
            <TaskListView
              key={task.id}
              task={task}
              navigateTo={navigateToTask}
              onEdit={handleEditTask}
              onDelete={confirmDeleteTask}
            />
          )
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-0 lg:pr-10">
      <SearchTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {activeTab === 'projects' ? (
        <ProjectFilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
        />
      ) : (
        <TaskFilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
        />
      )}

      {activeTab === "projects" ? renderProjects() : renderTasks()}

      <DeleteModel
        isOpen={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        deleteTarget={deleteContent}
      />
    </div>
  );
};

export default HomePage;

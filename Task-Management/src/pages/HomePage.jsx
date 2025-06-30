import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SearchTabs from "../components/HomePage/SearchTabs";
import ProjectFilterBar from "../components/HomePage/ProjectFilterBar";
import TaskFilterBar from "../components/HomePage/TaskFilterBar"; // ✅ NEW
import ProjectGridView from "../components/HomePage/ProjectGridView";
import ProjectListView from "../components/HomePage/ProjectListView";
import TaskGridView from "../components/HomePage/TaskGridView";
import TaskListView from "../components/HomePage/TaskListView";
import EmptyState from "../components/HomePage/EmptyState";
import { filterProjects, filterTasks } from "../components/HomePage/utils";

import { getTasksByUser } from "../actions/taskActions";
import { getStatuses } from "../actions/taskActions"; // ✅ Fetch status list

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("projects");
  const [projectFilter, setProjectFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all"); // ✅ NEW
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { projects = [] } = useSelector((state) => state.projects);
  const { tasks: userTasks = [] } = useSelector((state) => state.userTasks);

  useEffect(() => {
    dispatch(getTasksByUser());
    dispatch(getStatuses()); // ✅ Fetch statuses for filter
  }, [dispatch]);

  const navigateToProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const navigateToTask = (taskId) => {
    navigate(`/projects/${userTasks.project_id}/tasks/${taskId}`);
  };

  const filteredProjects = filterProjects(projects, projectFilter, searchTerm);
  const filteredTasks = filterTasks(userTasks, taskFilter, searchTerm); // ✅

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
              navigateTo={navigateToProject}
            />
          ) : (
            <ProjectListView
              key={project.id}
              project={project}
              userTasks={tasksForProject}
              navigateTo={navigateToProject}
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
            <TaskGridView key={task.id} task={task} navigateTo={navigateToTask} />
          ) : (
            <TaskListView key={task.id} task={task} navigateTo={navigateToTask} />
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
    </div>
  );
};

export default HomePage;

import API from "../services/api";
import {
  ALL_PROJECTS_REQUEST,
  ALL_PROJECTS_SUCCESS,
  ALL_PROJECTS_FAIL,
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_SUCCESS,
  ADD_PROJECT_FAIL,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAIL,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  PROJECT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/projectConstants";

// Get all projects
export const getAllProjects = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PROJECTS_REQUEST });
    const { data } = await API.get("/projects", { withCredentials: true });
    console.log('get project', data);

    dispatch({ type: ALL_PROJECTS_SUCCESS, payload: data.projects });
  } catch (error) {
    dispatch({
      type: ALL_PROJECTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add a new project
export const addProject = (projectData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PROJECT_REQUEST });
    console.log("projectData", projectData);
    const { data } = await API.post("/projects/add", projectData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    
    dispatch({ type: ADD_PROJECT_SUCCESS, payload: data.message });

    dispatch(getAllProjects());

  } catch (error) {
    dispatch({
      type: ADD_PROJECT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.log('eror', error);

  }
};

// Update existing project
export const updateProject = (id, projectData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROJECT_REQUEST });
    await API.put(`/projects/${id}`, projectData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: UPDATE_PROJECT_SUCCESS });
    dispatch(getAllProjects());
  } catch (error) {
    dispatch({
      type: UPDATE_PROJECT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete project
export const deleteProject = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PROJECT_REQUEST });
    await API.delete(`/projects/${id}`, { withCredentials: true });
    dispatch({ type: DELETE_PROJECT_SUCCESS });
    dispatch(getAllProjects());
  } catch (error) {
    dispatch({
      type: DELETE_PROJECT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get project details by ID
export const getProjectDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_DETAILS_REQUEST });
    const { data } = await API.get(`/projects/${id}`, { withCredentials: true });
    dispatch({ type: PROJECT_DETAILS_SUCCESS, payload: data.project });
  } catch (error) {
    dispatch({
      type: PROJECT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

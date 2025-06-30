import API from "../services/api";
import {
  ALL_TASKS_REQUEST,
  ALL_TASKS_SUCCESS,
  ALL_TASKS_FAIL,
  ADD_TASK_REQUEST,
  ADD_TASK_SUCCESS,
  ADD_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  ADD_TASK_NOTE_REQUEST,
  ADD_TASK_NOTE_SUCCESS,
  ADD_TASK_NOTE_FAIL,
  GET_TASK_NOTES_REQUEST,
  GET_TASK_NOTES_SUCCESS,
  GET_TASK_NOTES_FAIL,
  DELETE_TASK_NOTE_REQUEST,
  DELETE_TASK_NOTE_SUCCESS,
  DELETE_TASK_NOTE_FAIL,
  CLEAR_ERRORS,
  TASK_DETAIL_SUCCESS,
  TASK_DETAIL_REQUEST,
  TASK_DETAIL_FAIL,
  GET_STATUS_REQUEST,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAIL,
} from "../constants/taskConstants";

// Get all tasks by project ID
export const getTasksByProject = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: ALL_TASKS_REQUEST });
    const { data } = await API.get(`/tasks/project/${projectId}`, { withCredentials: true });
    
    dispatch({ type: ALL_TASKS_SUCCESS, payload: data.tasks });
  } catch (error) {
    dispatch({
      type: ALL_TASKS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Get detailed info for a single task (including notes and audit logs)
export const getTaskDetail = (taskId) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DETAIL_REQUEST });
    const { data } = await API.get(`/tasks/${taskId}/detail`, { withCredentials: true });
    
    dispatch({
      type: TASK_DETAIL_SUCCESS,
      payload: {
        task: data.task,
        notes: data.notes,
        auditLogs: data.auditLogs,
      },
    });
  } catch (error) {
    dispatch({
      type: TASK_DETAIL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Create a new task
// export const createTask = (projectId, taskData) => async (dispatch) => {
//   try {
//     dispatch({ type: ADD_TASK_REQUEST });
//     await API.post(`/tasks/${projectId}/add`, taskData, {
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true,
//     });
//     dispatch({ type: ADD_TASK_SUCCESS });
//     dispatch(getTasksByProject(projectId));
//   } catch (error) {
//     dispatch({
//       type: ADD_TASK_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//   }
// };

export const createTask = (projectId, taskData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TASK_REQUEST });

    const { data } = await API.post(`/tasks/${projectId}/add`, taskData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    dispatch({ type: ADD_TASK_SUCCESS });

    dispatch(getTasksByProject(projectId));
    
    // ✅ fetch audit logs for the newly created task
    if (data?.task?.id) {
      dispatch(getTaskDetail(data.task.id));
    }

  } catch (error) {
    dispatch({
      type: ADD_TASK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update task
// export const updateTask = (taskId, taskData, projectId) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_TASK_REQUEST });
//     await API.put(`/tasks/${taskId}`, taskData, {
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true,
//     });
//     dispatch({ type: UPDATE_TASK_SUCCESS });
//     dispatch(getTasksByProject(projectId));
//   } catch (error) {
//     dispatch({
//       type: UPDATE_TASK_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//   }
// };
export const updateTask = (taskId, taskData, projectId) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_REQUEST });

    await API.put(`/tasks/${taskId}`, taskData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    dispatch({ type: UPDATE_TASK_SUCCESS });

    dispatch(getTasksByProject(projectId));

    // ✅ fetch updated audit logs
    dispatch(getTaskDetail(taskId));

  } catch (error) {
    dispatch({
      type: UPDATE_TASK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete task
export const deleteTask = (taskId, projectId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TASK_REQUEST });
    await API.delete(`/tasks/${taskId}`, { withCredentials: true });
    dispatch({ type: DELETE_TASK_SUCCESS });
    dispatch(getTasksByProject(projectId));
  } catch (error) {
    dispatch({
      type: DELETE_TASK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add note to task
// export const addTaskNote = (taskId, note) => async (dispatch) => {
//   try {
//     dispatch({ type: ADD_TASK_NOTE_REQUEST });
//     const { data } = await API.post(`/tasks/${taskId}/notes`, { note }, { withCredentials: true });
//     dispatch({ type: ADD_TASK_NOTE_SUCCESS, payload: data.note });
//     dispatch(getTaskNotes(taskId));
//   } catch (error) {
//     dispatch({
//       type: ADD_TASK_NOTE_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//   }
// };
export const addTaskNote = (taskId, note) => async (dispatch) => {
  try {
    dispatch({ type: GET_TASK_NOTES_REQUEST });
    
    const { data } = await API.post(
      `/tasks/${taskId}/notes`,
      { note },
      { withCredentials: true }
    );

    dispatch({ type: ADD_TASK_NOTE_SUCCESS, payload: data.note }); // ✅ pass full note

  } catch (error) {
    dispatch({
      type: ADD_TASK_NOTE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get task notes
export const getTaskNotes = (taskId) => async (dispatch) => {
  try {
    dispatch({ type: GET_TASK_NOTES_REQUEST });
    const { data } = await API.get(`/tasks/${taskId}/notes`, { withCredentials: true });
    dispatch({ type: GET_TASK_NOTES_SUCCESS, payload: data.notes });
  } catch (error) {
    dispatch({
      type: GET_TASK_NOTES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete note
export const deleteTaskNote = (noteId, taskId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TASK_NOTE_REQUEST });
    await API.delete(`/tasks/notes/${noteId}`, { withCredentials: true });
    dispatch({ type: DELETE_TASK_NOTE_SUCCESS });
    dispatch(getTaskNotes(taskId));
  } catch (error) {
    dispatch({
      type: DELETE_TASK_NOTE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getStatuses = () => async (dispatch) => {
  try {
    dispatch({ type: GET_STATUS_REQUEST });
    const { data } = await API.get('/statuses', { withCredentials: true });
    
    dispatch({ type: GET_STATUS_SUCCESS, payload: data.statuses });
  } catch (error) {
    dispatch({
      type: GET_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearTaskErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};



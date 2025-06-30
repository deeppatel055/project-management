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
  TASK_DETAIL_REQUEST,
  TASK_DETAIL_SUCCESS,
  TASK_DETAIL_FAIL,
  GET_STATUS_REQUEST,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAIL,
  USER_TASKS_REQUEST,
  USER_TASKS_SUCCESS,
  USER_TASKS_FAIL,
} from "../constants/taskConstants";

// ✅ Tasks List Reducer
export const tasksReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case ALL_TASKS_REQUEST:
      return { loading: true, tasks: [] };
    case ALL_TASKS_SUCCESS:
      return { loading: false, tasks: action.payload };
    case ALL_TASKS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Task Operation Reducer (Create/Update/Delete)
export const taskOperationReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TASK_REQUEST:
    case UPDATE_TASK_REQUEST:
    case DELETE_TASK_REQUEST:
      return { loading: true };
    case ADD_TASK_SUCCESS:
    case UPDATE_TASK_SUCCESS:
    case DELETE_TASK_SUCCESS:
      return { loading: false, success: true };
    case ADD_TASK_FAIL:
    case UPDATE_TASK_FAIL:
    case DELETE_TASK_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Task Notes Reducer (used if you're separately managing notes)
export const taskNotesReducer = (state = { notes: [] }, action) => {
  switch (action.type) {
    case GET_TASK_NOTES_REQUEST:
      return { loading: true, notes: [] };
    case GET_TASK_NOTES_SUCCESS:
      return { loading: false, notes: action.payload };
    case GET_TASK_NOTES_FAIL:
      return { loading: false, error: action.payload };

    case ADD_TASK_NOTE_REQUEST:
    case DELETE_TASK_NOTE_REQUEST:
      return { ...state, loadingNote: true };

    case ADD_TASK_NOTE_SUCCESS:
      return {
        ...state,
        loadingNote: false,
        successNote: true,
        notes: [action.payload, ...state.notes], // ✅ newest on top
      };
    case DELETE_TASK_NOTE_SUCCESS:
      return {
        ...state,
        loadingNote: false,
        successNote: true,
        notes: state.notes.filter(note => note.id !== action.payload),
      };

    case ADD_TASK_NOTE_FAIL:
    case DELETE_TASK_NOTE_FAIL:
      return { ...state, loadingNote: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Task Detail Reducer (used by the task detail page with notes and auditLogs)
export const taskDetailReducer = (state = { task: {}, notes: [], auditLogs: [] }, action) => {
  switch (action.type) {
    case TASK_DETAIL_REQUEST:
      return { loading: true, task: {}, notes: [], auditLogs: [] };
    case TASK_DETAIL_SUCCESS:
      return {
        loading: false,
        task: action.payload.task,
        notes: action.payload.notes,
        auditLogs: action.payload.auditLogs,
      };
    case TASK_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    // ✅ Append new note to notes array in taskDetail
    case ADD_TASK_NOTE_SUCCESS:
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };

    // ✅ Remove deleted note from notes array in taskDetail
    case DELETE_TASK_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };

    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// ✅ Status List Reducer
export const statusListReducer = (state = { statuses: [] }, action) => {
  switch (action.type) {
    case GET_STATUS_REQUEST:
      return { loading: true, statuses: [] };
    case GET_STATUS_SUCCESS:
      return { loading: false, statuses: action.payload };
    case GET_STATUS_FAIL:
      return { loading: false, error: action.payload, statuses: [] };
    default:
      return state;
  }
};


export const userTasksReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case USER_TASKS_REQUEST:
      return { loading: true, tasks: [] };
    case USER_TASKS_SUCCESS:
      return { loading: false, tasks: action.payload };
    case USER_TASKS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

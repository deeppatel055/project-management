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

export const projectsReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case ALL_PROJECTS_REQUEST:
      return { ...state, loading: true };
    case ALL_PROJECTS_SUCCESS:
      return { loading: false, projects: action.payload };
    case ALL_PROJECTS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const newProjectReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROJECT_REQUEST:
      return { loading: true };
    case ADD_PROJECT_SUCCESS:
      return { loading: false, success: true };
    case ADD_PROJECT_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const projectReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROJECT_REQUEST:
    case DELETE_PROJECT_REQUEST:
      return { loading: true };
    case UPDATE_PROJECT_SUCCESS:
      return { loading: false, isUpdated: true };
    case DELETE_PROJECT_SUCCESS:
      return { loading: false, isDeleted: true };
    case UPDATE_PROJECT_FAIL:
    case DELETE_PROJECT_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const projectDetailsReducer = (state = { project: {} }, action) => {
  switch (action.type) {
    case PROJECT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PROJECT_DETAILS_SUCCESS:
      return { loading: false, project: action.payload };
    case PROJECT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

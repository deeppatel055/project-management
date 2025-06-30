import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import {
  userReducer,       // Your user auth & current user reducer
  allUsersReducer,   // Your users list reducer
  userDetailsReducer, // User by ID reducer
  passwordReducer
} from "../reducers/userReducers";  // Adjust the path as needed

import {
  projectsReducer,
  newProjectReducer,
  projectReducer,
  projectDetailsReducer,
} from "../reducers/projectReducers";

import {
  tasksReducer,            // for fetching tasks by project
  taskOperationReducer,    // for create/update/delete
  taskNotesReducer,         // for notes CRUD
  taskDetailReducer,
  statusListReducer
} from "../reducers/taskReducers";  // adjust the path if needed


const rootReducer = combineReducers({
  // User
  user: userReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  password: passwordReducer,

  // Project
  projects: projectsReducer,
  newProject: newProjectReducer,
  project: projectReducer,
  projectDetails: projectDetailsReducer,

  // Task
  tasks: tasksReducer,
  taskDetail: taskDetailReducer,
  taskOperations: taskOperationReducer,
  taskNotes: taskNotesReducer,

  statusList: statusListReducer,

});



const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

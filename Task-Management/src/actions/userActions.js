import API from "../services/api";
import {
  LOAD_CURRENT_USER_REQUEST,
  LOAD_CURRENT_USER_SUCCESS,
  LOAD_CURRENT_USER_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL
} from "../constants/userConstants";

// Get current logged-in user
export const loadCurrentUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_CURRENT_USER_REQUEST });
    const { data } = await API.get("/users/me", { withCredentials: true });
    dispatch({ type: LOAD_CURRENT_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LOAD_CURRENT_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
export const getAllUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const role = getState().user?.user?.role;

    if (!["admin", "superadmin"].includes(role)) {
      dispatch({ type: ALL_USERS_SUCCESS, payload: [] }); // Hide users if no access
      return;
    }

    const { data } = await API.get("/users", { withCredentials: true });
    dispatch({ type: ALL_USERS_SUCCESS, payload: data.user });

  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add user (Admin and Superadmin only)
// export const addUser = (userFormData) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ADD_USER_REQUEST });

//     const role = getState().user?.user?.role;
//     if (!["admin", "superadmin"].includes(role)) {
//       throw new Error("Access denied. Only admins can add users.");
//     }

//     await API.post("/users/add", userFormData, {
//       headers: { "Content-Type": "multipart/form-data" },
//       withCredentials: true,
//     });

//     dispatch({ type: ADD_USER_SUCCESS });
//     // alert("User added. Verification email sent.");
//     dispatch(getAllUsers());

//   } catch (error) {
//     dispatch({
//       type: ADD_USER_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//     console.log('add user error', error);
    
//   }
// };
// export const addUser = (userFormData) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ADD_USER_REQUEST });

//     const role = getState().user?.user?.role;
//     if (!["admin", "superadmin"].includes(role)) {
//       throw new Error("Access denied. Only admins can add users.");
//     }

//     await API.post("/users/add", userFormData, {
//       headers: { "Content-Type": "multipart/form-data" },
//       withCredentials: true,
//     });

//     dispatch({ type: ADD_USER_SUCCESS });
//     dispatch(getAllUsers());

//     // ✅ Optional: return a success response
//     return { success: true };
//   } catch (error) {
//     const errMsg = error.response?.data?.message || error.message;
//     dispatch({
//       type: ADD_USER_FAIL,
//       payload: errMsg,
//     });

//     console.log('add user error', error);
//     throw new Error(errMsg); // ✅ Rethrow so component can catch it
//   }
// };

export const addUser = (userFormData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_USER_REQUEST });

    const role = getState().user?.user?.role;
    if (!["admin", "superadmin"].includes(role)) {
      throw new Error("Access denied. Only admins can add users.");
    }

    await API.post("/users/add", userFormData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    dispatch({ type: ADD_USER_SUCCESS });
    dispatch(getAllUsers());

    return { success: true };
  } catch (error) {
    dispatch({
      type: ADD_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.log("add user error", error);
    return { success: false, message: error.message };
  }
};


// Edit user (Allowed: self or Admin/Superadmin)
export const editUser = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: EDIT_USER_REQUEST });

    const id = userData.get("id");
    const currentUser = getState().user?.user;
    const isSelf = currentUser?.id === parseInt(id);
    const isAdmin = ["admin", "superadmin"].includes(currentUser?.role);

    if (!isSelf && !isAdmin) {
      throw new Error("Access denied. Cannot edit this user.");
    }

    await API.put(`/users/edit/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    dispatch({ type: EDIT_USER_SUCCESS });

    if (isSelf) {
      dispatch(loadCurrentUser());
    }

    dispatch(getAllUsers());

  } catch (error) {
    dispatch({
      type: EDIT_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete user (Superadmin only)
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const role = getState().user?.user?.role;
    if (!["admin", "superadmin"].includes(role)) {

      throw new Error("Access denied. Only admin and super admin can delete users.");
    }

    await API.delete(`/users/${id}`, { withCredentials: true });
    dispatch({ type: DELETE_USER_SUCCESS });
    dispatch(getAllUsers());

  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get user by ID
export const getUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await API.get(`/users/${id}`, { withCredentials: true });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Logout



export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // Send login request
    await API.post(
      "/users/login",
      { email, password },
      { withCredentials: true } // important to send cookies
    );

    // After successful login, load current user data
    const { data } = await API.get("/users/me", { withCredentials: true });

    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await API.post("/users/logout", {}, { withCredentials: true });
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};


export const refreshToken = () => async (dispatch) => {
  try {
    await API.post("/users/refresh-token", null, { withCredentials: true });
    // Optionally reload current user if needed
    const { data } = await API.get("/users/me", { withCredentials: true });
    dispatch({ type: LOAD_CURRENT_USER_SUCCESS, payload: data });
  } catch (error) {
    // handle failure, maybe logout
    dispatch({ type: LOAD_CURRENT_USER_FAIL, payload: error.message });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await API.post(
      "/users/forgot-password",
      { email },
      { ...config, withCredentials: true }
    );

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await API.post(
      `/users/reset-password`,
      { token, ...passwords }, // passwords: { password, confirmPassword }
      { ...config, withCredentials: true }
    );

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
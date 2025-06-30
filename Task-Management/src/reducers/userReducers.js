// src/reducers/userReducers.js

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    LOAD_CURRENT_USER_REQUEST,
    LOAD_CURRENT_USER_SUCCESS,
    LOAD_CURRENT_USER_FAIL,
    FORGOT_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_FAIL,
    // other constants...
} from "../constants/userConstants";

export const userReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOAD_CURRENT_USER_REQUEST:
            return { loading: true, isAuthenticated: false };
        case LOGIN_SUCCESS:
        case LOAD_CURRENT_USER_SUCCESS:
            return { loading: false, isAuthenticated: true, user: action.payload };
        case LOGIN_FAIL:
        case LOAD_CURRENT_USER_FAIL:
            return { loading: false, isAuthenticated: false, user: null, error: action.payload };
        case LOGOUT_SUCCESS:
            return { loading: false, isAuthenticated: false, user: null };
        case LOGOUT_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const allUsersReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case ALL_USERS_REQUEST:
            return { ...state, loading: true };
        case ALL_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload };
        case ALL_USERS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {

        case USER_DETAILS_REQUEST:
            return { loading: true, user: {} };
        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_DETAILS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};



export const passwordReducer = (state = {}, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
            return { loading: true };
        case FORGOT_PASSWORD_SUCCESS:
        case RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true, message: action.payload };
        case FORGOT_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../../utility';

/**
 * Initial state given to the `reducer` function.
 */
export const initialState = {
    userId: null, // userId of the user
    secretKey: null, // Encryption key for user data
    logging: false, // For spinner
    expiresOn: null, // Token expiry timestamp
    authCheckComplete: false, // To check if authentication procedure is complete. Used when app reloads.
    error: null // Is set if any failure occurs during authentication
}

/**
 * @function authReducer
 * @param {Object} state - State object of Auth reducer
 * @param {Object} action - Action type to reduce the state of the Auth reducer
 * @returns {Object} - Reduced state
 */
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_USER_START:
            return updateObject(state, authStartReducer(state));
        case actionTypes.AUTH_USER_SUCCESS:
            return updateObject(state, authSuccessReducer(state, action.payload));
        case actionTypes.AUTH_USER_FAILED:
            return updateObject(state, authFailedReducer(state, action.payload))
        case actionTypes.AUTH_USER_LOGOUT:
            return { ...initialState };
        case actionTypes.AUTH_ERROR_RESET:
            return updateObject(state, authErrorResetReducer());
        default:
            return state;
    }
}

/**
 * Function to start sign-in process, which sets the spinner on
 * @function authStartReducer
 * @param {Object} state - Reducer state
 * @returns {Object} - Reduced state
 */
const authStartReducer = (state) => {
    return {
        ...state,
        logging: true,
        authCheckComplete: false,
    };
}

/**
 * Function to reduce the state to a `successful` logged-in state.
 * @function authSuccessReducer
 * @param {Object} state - Reducer state
 * @param {Object} payload - payload consists of expiresOn, userId
 * @param {number} payload.expiresOn - Token expiry 
 * @param {string} payload.userId - User-id/username
 * @param {string} payload.secretKey - Encryption key
 * @return {Object} - Reduced state
 */
const authSuccessReducer = (state, payload) => {
    return {
        ...state,
        secretKey: payload.secretKey,
        logging: false,
        expiresOn: payload.expiresOn,
        userId: payload.userId,
        error: null,
        authCheckComplete: true
    };
}

/**
 * Function to reduce the state to `failed` logged-in state. 
 * @function authFailedReducer
 * @param {Object} state - Reducer state
 * @param {string} error - Error produced while trying to log-in
 * @returns {Object} - Reduced state.
 */
const authFailedReducer = (state, error) => {
    return {
        ...state,
        logging: false,
        authCheckComplete: true,
        error: error
    };
}

/**
 * Function to reset the error set in the reducer state.
 * @function authErrorResetReducer
 * @param {Object} state - Reducer state
 * @returns {Object} - Reduced state.
 */
const authErrorResetReducer = (state) => {
    return {
        ...state,
        error: null
    };
}


export default reducer;
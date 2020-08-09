import * as actions from '../actionTypes';
import axios from 'axios';

/**
 * Authentication end point
 */
const loginUrl = "http://localhost:8080/api/authenticate";

/**
 * Action creator to start the spinner up
 *      while authenticating
 * 
 * @function authStart
 * @returns {Object} - Redux action type
 */
export const authStart = () => {
    return {
        type: actions.AUTH_USER_START
    };
}

/**
 * Action creator to update the authentication status
 *      as successful
 * 
 * @function authSuccess
 * @param {String} idToken - JWT authentication token 
 * @param {Number} expiresOn - Time when token expires (in milliseconds)
 * @param {String} userId - User Id
 * @returns {Object} - Redux action type and payload
 */
export const authSuccess = (idToken, expiresOn, userId) => {

    localStorage.setItem('token', idToken);
    localStorage.setItem('expiresOn', expiresOn);
    localStorage.setItem('userId', userId);

    return {
        type: actions.AUTH_USER_SUCCESS,
        payload: {
            idToken: idToken,
            expiresOn: expiresOn,
            userId: userId
        }
    };
}

/**
 * Function to clear authentication token and
 *      user related data from `local storage`
 * 
 * @function logout
 * @returns {Object} - Redux action type.
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresOn');
    localStorage.removeItem('userId');
    return {
        type: actions.AUTH_USER_LOGOUT
    };
}

/**
 * Action creator to trigger auto logout whenever the 
 *      authentication token expires
 * 
 * @function checkAuthTimeOut
 * @param {Number} expiresIn
 * @returns {Function}
 */
export const checkAuthTimeOut = (expiresIn) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expiresIn);  
    };
}

/**
 * Action creator to set the error message
 *      generated during authentication
 * 
 * @function authFailed
 * @param {String} error - Error message
 * @returns {Object} - Redux action type and payload
 */
export const authFailed = (error) => {
    return {
        type: actions.AUTH_USER_FAILED,
        payload: error
    };
}

/**
 * Action creator to clear the error message
 *      if there is any.
 */
export const clearError = () => {
    return {
        type: actions.AUTH_ERROR_RESET
    };
}




/**
 * Async action creator to check if authentication is valid
 *      by checking on `local storage`
 * 
 * @function tryAutoLogin
 * @returns {Function}
 */
export const tryAutoLogin = () => {
    return dispatch => {
        const idToken  = localStorage.getItem('token');
        if (!idToken) dispatch(logout());
        else {
            const expiryTime = localStorage.getItem('expiresOn');
            if (!expiryTime) {
                dispatch(logout());
            } else {
                const expiresOn = new Date(expiryTime);
                if (expiresOn > new Date()) {
                    const userId = localStorage.getItem('userId');
                    if (!userId) dispatch(logout());
                    else {
                        dispatch(authSuccess(idToken, expiresOn, userId));
                        const timeInSeconds = (expiresOn.getTime() - new Date().getTime());
                        dispatch(checkAuthTimeOut(timeInSeconds));
                    }
                } else {
                    dispatch(logout());
                }
            }
        }
    }
}

/**
 * Async Action Creators will validate the credential given
 * 
 * @function authUser
 * @param {Object} credential - Contains username and password
 * @returns {function}
 */
export const authUser = (credential) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(loginUrl, credential)
            .then(response => {
                const idToken = response.data.token;
                const expiresOn = new Date(response.data.expiresOn * 1000);
                const userId = response.data.userId;

                if (!idToken || !expiresOn || !userId) {
                    dispatch(authFailed("Unknown error."));
                } else {
                    dispatch(authSuccess(idToken, expiresOn, userId));
                    dispatch(checkAuthTimeOut(expiresOn - new Date().getTime()));
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    dispatch(authFailed(error.response.data.message));
                } else {
                    const errorResponse = "Failed to connect to Server. Check network connectivity";
                    dispatch(authFailed(errorResponse));
                }
            })
    }
}


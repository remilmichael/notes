import * as actions from '../actionTypes';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { ROOT_URL } from '../../../utility';


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
 * @param {Number} expiresOn - Time when token expires (in milliseconds)
 * @param {String} userId - User Id
 * @returns {Object} - Redux action type and payload
 */
export const authSuccess = (expiresOn, userId) => {

    localStorage.setItem('expiresOn', expiresOn);
    localStorage.setItem('userId', userId);

    return {
        type: actions.AUTH_USER_SUCCESS,
        payload: {
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
        const expiryTime = localStorage.getItem('expiresOn');
        if (!expiryTime) {
            dispatch(logout());
        } else {
            const expiresOn = new Date(expiryTime);
            if (expiresOn > new Date()) {
                const userId = localStorage.getItem('userId');
                if (!userId) dispatch(logout());
                else {
                    dispatch(authSuccess(expiresOn, userId));
                    const timeInSeconds = (expiresOn.getTime() - new Date().getTime());
                    dispatch(checkAuthTimeOut(timeInSeconds));
                }
            } else {
                dispatch(logout());
            }
        }
    }
}

/**
 * Async Action Creators will validate the credential given
 * 
 * @function authUser
 * @param {Object} credential
 * @param {string} credential.username
 * @param {string} credential.password
 * @returns {function}
 */
export const authUser = (credential) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(`${ROOT_URL}/authenticate`, credential, { withCredentials: true })
            .then(response => {
                let expiresOn, userId, secretKey;
                if (response.data) {
                    expiresOn = new Date(response.data.expiresOn * 1000);
                    userId = response.data.userId;
                    secretKey = response.data.secretKey;
                    const hmac = secretKey.substring(0, 64);
                    const encryptedKey = secretKey.substring(64, secretKey.length);
                    const computedHmac = CryptoJS.HmacSHA256(encryptedKey, credential.username + credential.password);
                    if (hmac !== computedHmac.toString()) {
                        dispatch(authFailed('WARNING: Secret tampered'));
                    } else {
                        secretKey = CryptoJS.AES.decrypt(encryptedKey, credential.password).toString(CryptoJS.enc.Utf8);
                    }
                }
                if (!expiresOn || !userId || !secretKey) {
                    dispatch(authFailed("Unknown error."));
                } else {



                    dispatch(authSuccess(expiresOn, userId));
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


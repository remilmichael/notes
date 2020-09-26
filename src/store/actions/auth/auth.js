import * as actions from '../actionTypes';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

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
 * @param {number} expiresOn - Time when token expires (in milliseconds)
 * @param {string} userId - User Id
 * @param {string} secretKey - Key to encrypt all user data
 * @param {string} encryptionKey - Key to encrypt secretKey, for the current session
 * @param {string} keyId - Unique id for encryptionKey - To support multi device login simultaneously
 * @returns {Object} - Redux action type and payload
 */
export const authSuccess = (expiresOn, userId, secretKey, encryptionKey, keyId) => {

    localStorage.setItem('expiresOn', expiresOn);
    localStorage.setItem('userId', userId);
    localStorage.setItem('encryptionKey', encryptionKey);
    localStorage.setItem('keyId', keyId);

    return {
        type: actions.AUTH_USER_SUCCESS,
        payload: {
            expiresOn: expiresOn,
            userId: userId,
            secretKey: secretKey
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
    localStorage.removeItem('encryptionKey');
    localStorage.removeItem('keyId');

    return {
        type: actions.AUTH_USER_LOGOUT
    };
}

/**
 * Action creator to trigger auto logout whenever the 
 *      authentication token expires
 * 
 * @function checkAuthTimeOut
 * @param {number} expiresIn
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
 * @param {string} error - Error message
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
 * @returns {function}
 */
export const tryAutoLogin = () => {
    const expiryTime = localStorage.getItem('expiresOn');
    const userId = localStorage.getItem('userId');
    const encryptionKey = localStorage.getItem('encryptionKey');
    const keyId = localStorage.getItem('keyId');

    return async (dispatch) => {
        if (!expiryTime || !userId || !encryptionKey || !keyId) {
            dispatch(logout());
        } else {
            const expiresOn = new Date(expiryTime);
            if (expiresOn > new Date()) {

                const requestObject = {
                    username: userId,
                    uuid: keyId
                }
                let secretKey;
                try {
                    const response = await axios.post(`${ROOT_URL}/session/fetch`, requestObject,
                        { withCredentials: true }
                    );
                    if (response && response.data) {
                        const encodedString = response.data.secretKey;
                        const hmac = encodedString.substring(0, 64);
                        const encryptedKeyFromDbWithUuid = encodedString.substring(64, encodedString.length);
                        const computedHmac = CryptoJS.HmacSHA256(encryptedKeyFromDbWithUuid, encryptionKey);
                        if (computedHmac.toString() !== hmac) {
                            dispatch(logout());
                            dispatch(authFailed('Warning: Key Tampered'));
                        } else {
                            secretKey = CryptoJS.AES.decrypt(encryptedKeyFromDbWithUuid, encryptionKey).toString(CryptoJS.enc.Utf8);
                            secretKey = secretKey.substring(0, 64);
                            dispatch(authSuccess(expiresOn, userId, secretKey, encryptionKey, keyId));
                            const timeInSeconds = (expiresOn.getTime() - new Date().getTime());
                            dispatch(checkAuthTimeOut(timeInSeconds));
                        }
                    }
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        dispatch(authFailed(error.response.data.message))
                    } else {
                        dispatch(authFailed('Something went wrong'));
                    }
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
    return async (dispatch) => {
        dispatch(authStart());
        let expiresOn, userId, secretKey;
        try {
            const response = await axios.post(`${ROOT_URL}/authenticate`, credential,
                { withCredentials: true });
            if (response && response.data) {
                expiresOn = new Date(response.data.expiresOn * 1000);
                userId = response.data.userId;
                secretKey = response.data.secretKey;
                const hmac = secretKey.substring(0, 64);
                const encryptedKey = secretKey.substring(64, secretKey.length);
                const computedHmac = CryptoJS.HmacSHA256(encryptedKey, credential.username + credential.password);
                if (hmac !== computedHmac.toString()) {
                    dispatch(authFailed('WARNING: Secret tampered!'));
                } else {
                    secretKey = CryptoJS.AES.decrypt(encryptedKey, credential.password).toString(CryptoJS.enc.Utf8);
                    if (!expiresOn || !userId || !secretKey) {
                        dispatch(authFailed("Missing credentials in storage"));
                    } else {
                        const salt = CryptoJS.lib.WordArray.random(128 / 8);
                        const key = CryptoJS.PBKDF2(credential.username + credential.password + new Date().getTime(), salt, {
                            keySize: 256 / 32,
                        });
                        const encryptedKey = CryptoJS.AES.encrypt(secretKey + uuidv4(), key.toString());
                        const hmac = CryptoJS.HmacSHA256(encryptedKey.toString(), key.toString());
                        const finalKey = hmac.toString() + encryptedKey.toString();
                        const keyId = uuidv4();
                        const requestObject = {
                            username: credential.username,
                            sessionSecretKey: finalKey,
                            keyId: keyId
                        }
                        try {
                            const resp = await axios.post(`${ROOT_URL}/session/create`,
                                requestObject, { withCredentials: true });
                            if (resp) {
                                dispatch(authSuccess(expiresOn, userId, secretKey, key.toString(), keyId));
                                dispatch(checkAuthTimeOut(expiresOn - new Date().getTime()));
                            } else {
                                dispatch(authFailed("Something went wrong"));
                            }
                        } catch (error) {
                            if (error.response && error.response.data && error.response.data.message) {
                                dispatch(authFailed(error.response.data.message));
                            } else {
                                dispatch(authFailed('Something went wrong'));
                            }
                        }
                    }
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                dispatch(authFailed(error.response.data.message));
            } else {
                dispatch(authFailed('Something went wrong'));
            }
        }
    }
}


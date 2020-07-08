import * as actions from './actionTypes';
import axios from 'axios';

const loginUrl = "http://localhost:8080/api/authenticate";

export const authStart = () => {
    return {
        type: actions.AUTH_USER_START
    };
}

export const authSuccess = (idToken, expiresOn, userId) => {
    return {
        type: actions.AUTH_USER_SUCCESS,
        idToken: idToken,
        expiresOn: expiresOn,
        userId: userId
    };
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresOn');
    localStorage.removeItem('userId');
    return {
        type: actions.AUTH_USER_LOGOUT
    };
}

export const checkAuthTimeOut = (expiresIn) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expiresIn);  
    };
}

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
                        /* Used with firebase */
                        // const timeInSeconds = ((expiresOn.getTime() - new Date().getTime()) / 1000);
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

export const authFailed = (err) => {
    return {
        type: actions.AUTH_USER_FAILED,
        error: err
    };
}

export const clearError = () => {
    return {
        type: actions.AUTH_ERROR_RESET
    };
}

export const authUser = (credential) => {
    return dispatch => {
        const url = loginUrl;
        dispatch(authStart());
        const requestObj = {
            ...credential
        }
        axios.post(url, requestObj)
            .then(response => {
                const idToken = response.data.token;
                /* Used with firebase */
                // const expiresOn = new Date(new Date().getTime() + response.data.expiresOn);

                const expiresOn = new Date(response.data.expiresOn * 1000);
                const userId = response.data.userId;

                if (idToken == null || expiresOn == null || userId == null) {
                    dispatch(authFailed("Unknown error. Missing required credentials"));
                } else {
                    localStorage.setItem('token', idToken);
                    localStorage.setItem('expiresOn', expiresOn);
                    localStorage.setItem('userId', userId);

                    dispatch(authSuccess(idToken, expiresOn, userId));
                    dispatch(checkAuthTimeOut(expiresOn - new Date().getTime()));
                }
            })
            .catch(error => {
                if (error.response) {
                    dispatch(authFailed(error.response.data.message));
                } else {
                    const errorResponse = "Failed to connect to Server. Check network connectivity";
                    dispatch(authFailed(errorResponse));
                }
            })
    }
}


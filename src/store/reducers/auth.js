import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    userId: null, // User Id generated from firebase (server)
    logging: false, // For spinner
    idToken: null, // Stores token for authentication
    expiresOn: null, // Token expiry timestamp
    authCheckComplete: false, // To check if authentication procedure is complete. Used when app reloads.
    error: null // Is set if any failure occurs during authentication
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_USER_START:
            return updateObject(state, authStartReducer());
        case actionTypes.AUTH_USER_SUCCESS:
            return updateObject(state, authSuccessReducer(action));
        case actionTypes.AUTH_USER_FAILED:
            return updateObject(state, authFailedReducer(action.error))
        case actionTypes.AUTH_USER_LOGOUT:
            return updateObject(state, logoutReducer());
        case actionTypes.AUTH_ERROR_RESET:
            return updateObject(state, authErrorResetReducer());
        default:
            return state;
    }
}

const authStartReducer = () => {
    return {
        logging: true,
        authCheckComplete: false,
    };
}

const authSuccessReducer = (action) => {
    return {
        logging: false,
        idToken: action.idToken,
        expiresOn: action.expiresOn,
        userId: action.userId,
        error: null,
        authCheckComplete: true
    };
}

const authFailedReducer = (error) => {
    return {
        logging: false,
        authCheckComplete: true,
        error: error
    };
}

const authErrorResetReducer = () => {
    return {
        error: null
    };
}

const logoutReducer = () => {
    return {
        userId: null,
        logging: false,
        idToken: null,
        expiresOn: null,
        error: null,
        authCheckComplete: false
    };
}

export default reducer;
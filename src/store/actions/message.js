import * as actions from './actionTypes';

export const setMessage = (message, type) => {
    return {
        type: actions.SET_GLOBAL_MESSAGE,
        message: message,
        msgType: type
    };
}

export const unsetMessage = () => {
    return {
        type: actions.UNSET_GLOBAL_MESSAGE,
    };
}
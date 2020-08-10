import * as actions from '../actionTypes';

/**
 * Action creator to set global message
 * 
 * @function setMessage
 * @param {String} message - Info messages created
 * @param {String} type - Type of message, to generate appropriate alert
 * @returns {Object} - Redux action type and message payload, and its type
 */
export const setMessage = (message, type) => {
    return {
        type: actions.SET_GLOBAL_MESSAGE,
        message: message,
        msgType: type
    };
}

/**
 * Action creator to clear the existing global message
 * 
 * @function unsetMessage
 * @return {Object} - Redux action type
 */
export const unsetMessage = () => {
    return {
        type: actions.UNSET_GLOBAL_MESSAGE,
    };
}
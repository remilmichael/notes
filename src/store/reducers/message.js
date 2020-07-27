import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    message: null,
    type: null // bootstrap alert types
}

/**
 * @function reducer - `message` reducer function
 * @param {Object} state 
 * @param {Object} action - Consists of message and its type
 */
export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_GLOBAL_MESSAGE:
            return updateObject(state, {message: action.message, type: action.msgType});
        case actionTypes.UNSET_GLOBAL_MESSAGE:
            return updateObject(state, {message: null, type: null}); 
        default:
            return state;
    };
}

export default reducer;
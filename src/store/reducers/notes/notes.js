import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../../utility';

/**
 * Initial state of `notes` reducer
 */
const initialState = {
    loadingNow: false,
    error: null,
    saveSuccessful: false,
};

/**
 * @function reducer - `notes` reducer fucntion
 * @param {Object} state
 * @param {Object} action 
 */
export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.RESET_NOTE_STATE_DEFAULT:
            return updateObject(state, resetState());
        case actionTypes.DB_ACTION_START:
            return updateObject(state, {loadingNow: true, error: null});
        case actionTypes.DB_ACTION_SUCCESS:
            return updateObject(state, saveSuccessReducer());
        case actionTypes.DB_ACTION_FAILED:
            return updateObject(state, {loadingNow: false, error: action.error});
        default:
            return state;
    };
}

/**
 * Function to reset state of the reducer
 * 
 * @function resetState
 * @returns {Object} - Updated state
 */
const resetState = () => {
    return {
        loadingNow: false,
        error: null,
        saveSuccessful: false,
    }
}

/**
 * Function to update the state when the save
 *      action is successful
 * 
 * @function saveSuccessReducer
 * @returns {Object} - Updated state
 */
const saveSuccessReducer = () => {
    return {
        error: null,
        saveSuccessful: true,
        loadingNow: false,
    };
}

export default reducer;
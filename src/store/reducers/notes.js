import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    isEditingExisting: false,
    loadingNow: false,
    error: null,
    saveSuccessful: false,
};

const reducer = (state = initialState, action) => {
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


const resetState = () => {
    return {
        isEditingExisting: false,
        loadingNow: false,
        error: null,
        saveSuccessful: false,
    }
}

const saveSuccessReducer = () => {
    return {
        error: null,
        saveSuccessful: true,
        loadingNow: false,
    };
}

export default reducer;
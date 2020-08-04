import * as actions from './actionTypes';
import axios from '../../axios-notes';

/**
 * Action creator to initiate the spinner
 * 
 * @function dbActionStart
 * @returns {Object} - Redux action type
 */
export const dbActionStart = () => {
    return {
        type: actions.DB_ACTION_START
    };
}

/**
 * Action creator to stop the spinner and set the database
 *      action as successful
 * 
 * @function dbActionSuccess
 * @returns {Object} - Redux action type
 */
export const dbActionSuccess = () => {
    return {
        type: actions.DB_ACTION_SUCCESS,
    };
}

/**
 * Action creator to stop the spinner and set the database
 *      action as failed
 * 
 * @function dbActionFailed
 * @param {String} - Error message generated
 * @returns {Object} - Redux action type and payload
 */
export const dbActionFailed = (error) => {
    return {
        type: actions.DB_ACTION_FAILED,
        error: error
    };
}

/**
 * Action creator to save the newly created note to the
 *      redux store.
 * @function saveNoteRedux
 * @param {Object} note 
 * @returns {Object} - Redux action type and payload
 */
export const saveNoteRedux = (note) => {
    return {
        type: actions.SAVE_NOTE_REDUX,
        payload: note
    };
}

/**
 * Function to create an action creator to update a note 
 *      in the redux store.
 * 
 * @function updateNoteInRedux
 * @param {Object} updatedNote - Note which is updated
 * @returns {Object} - Redux action type and payload
 */
export const updateNoteInRedux = (updatedNote) => {
    return {
        type: actions.UPDATE_NOTE_REDUX,
        payload: updatedNote
    }
}

/**
 * Action creator to delete the note with specified id
 *      from redux store.
 * 
 * @function deleteNoteFromRedux
 * @param {String} noteId - Note id to delete from redux store
 * @returns {Object} - Redux action type and payload
 */
export const deleteNoteFromRedux = (noteId) => {
    return {
        type: actions.DELETE_NOTE_REDUX,
        payload: noteId
    };
}

/**
 * Action creator to reset the `notes` reducer to its
 *      initial state.
 * 
 * @function resetToDefault
 * @returns {Object} - Redux action type
 */
export const resetToDefault = () => {
    return {
        type: actions.RESET_NOTE_STATE_DEFAULT
    }
}





/**
 * Function to save a new note, to dispatches actions to start and stop spinner,
 *      add note to the redux store.
 * 
 * @function saveNote
 * @param {Object} note - Note to be saved
 * @param {String} idToken - JWT token for authentication
 * @returns {Function} - Redux Thunk function
 */
export const saveNote = (note, idToken) => {
    return dispatch => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };

        dispatch(dbActionStart());
        axios.post('/notes', note, {
            headers: headers
        })
        .then(() => {
            dispatch(saveNoteRedux(note));
            dispatch(dbActionSuccess());
        })
        .catch(error => {
            if (error.response) {
                dispatch(dbActionFailed(error.response.data.message));
            } else {
                dispatch(dbActionFailed("CHECK NETWORK CONNECTIVITY"));
            }
        })
    }
}

/**
 * Function to update an existing note, to dispatches actions to start and stop spinner,
 *      update note in the redux store.
 * 
 * @function updateNote
 * @param {Object} note - Note to be updated
 * @param {String} idToken - JWT token for authentication
 * @returns {Function} - Redux Thunk function
 */
export const updateNote = (note, idToken) => {
    return dispatch => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };

        dispatch(dbActionStart());
        axios.put('/notes', note,{
                headers: headers
            })
            .then(() => {
                dispatch(updateNoteInRedux(note));
                dispatch(dbActionSuccess());
            })
            .catch(error => {
                if (error.response) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed("CHECK NETWORK CONNECTIVITY"));
                }
            })
    }
}

/**
 * Function to delete the note with specified `id` from database.
 * 
 * @function deleteNote
 * @param {String} noteId - Note id to delete
 * @param {String} idToken - JWT authentication token
 */
export const deleteNote = (noteId, idToken) => {
    return dispatch => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };
        dispatch(dbActionStart());
        axios.delete('/notes/' + noteId, {
            headers: headers
        })
        .then(() => {
            dispatch(deleteNoteFromRedux(noteId));
            dispatch(dbActionSuccess());
        })
        .catch(error => {
            dispatch(dbActionFailed(error.response));
        })
    };
}
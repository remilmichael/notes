import * as actions from '../actionTypes';
import axios from '../../../axios-notes';
import { encrypt } from '../../../utility';

export const defaultErrorMessage = "CHECK NETWORK CONNECTIVITY";

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
 * @param {string} encryptionKey - Key for encrypting data
 * @param {string} note.noteId - Note identifier
 * @param {string} note.noteHeading - Title for the note
 * @param {string} note.noteBody - Note body/content
 * @param {string} note.userId - User identifier to which the note belongs to
 * @param {string} note.lastUpdated - Last updated timestamp in milliseconds
 * @returns {Function} - Redux Thunk function
 */
export const saveNote = (note, encryptionKey) => {
    return dispatch => {
        const encryptedNote = {
            ...note,
            noteHeading: encrypt(note.noteHeading, encryptionKey),
            noteBody: encrypt(note.noteBody, encryptionKey)
        }
        dispatch(dbActionStart());
        axios.post('/notes', encryptedNote, {
            withCredentials: true
        })
            .then(() => {
                dispatch(saveNoteRedux(note));
                dispatch(dbActionSuccess());
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed(defaultErrorMessage));
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
 * @param {string} encryptionKey - Key for encrypting data
 * @param {string} note.noteId - Note identifier
 * @param {string} note.noteHeading - Title for the note
 * @param {string} note.noteBody - Note body/content
 * @param {string} note.userId - User identifier to which the note belongs to
 * @param {string} note.lastUpdated - Last updated timestamp in milliseconds
 * @returns {Function} - Redux Thunk function
 */
export const updateNote = (note, encryptionKey) => {
    return dispatch => {
        const encryptedNote = {
            ...note,
            noteHeading: encrypt(note.noteHeading, encryptionKey),
            noteBody: encrypt(note.noteBody, encryptionKey)
        }
        dispatch(dbActionStart());
        axios.put('/notes', encryptedNote, {
            withCredentials: true
        })
            .then(() => {
                dispatch(updateNoteInRedux(note));
                dispatch(dbActionSuccess());
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed(defaultErrorMessage));
                }
            })
    }
}

/**
 * Function to delete the note with specified `id` from database.
 * 
 * @function deleteNote
 * @param {String} noteId - Note id to delete
 */
export const deleteNote = (noteId) => {
    return dispatch => {

        dispatch(dbActionStart());
        axios.delete('/notes/' + noteId, {
            withCredentials: true
        })
            .then(() => {
                dispatch(deleteNoteFromRedux(noteId));
                dispatch(dbActionSuccess());
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed(defaultErrorMessage));
                }
            })
    };
}
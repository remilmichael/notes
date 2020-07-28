import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../../utility';

const initialState = {
    notes: [], // [{ noteId - String, noteHeading - String }]
    nextRecordNumber: 0,
    hasMoreNotes: true,
    loading: false,
    fetchFailed: false,
    PAGE_SIZE: 10 //FIXED
}
/**
 * @function reducer - `allNotes` reducer function
 * @param {Object} state - State given to reducer
 * @param {Object} action - Consists of type and payload
 */
export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SAVE_NOTES_LIST:
            return pushNote(state, action.payload);
        case actionTypes.SAVE_NOTE_REDUX:
            return addNote(state, action.payload)
        case actionTypes.DELETE_NOTE_REDUX:
            return deleteNote(state, action.payload);
        case actionTypes.CLEAR_NOTE_REDUX:
            return clearNotes(state);
        case actionTypes.FETCH_MORE_NOTES_START:
            return updateObject(state, { loading: true });
        case actionTypes.FETCH_NOTES_TITLES_FAILED:
            return updateObject(state, { loading: false, fetchFailed: true });
        default:
            return state;
    }
}

/**
 * Function to store all fetched note titles from the server
 * @function pushNote
 * @param {Object} state 
 * @param {Array} titles 
 * @returns {Object}
 */
const pushNote = (state, titles) => {
    if (titles.length === 0 ) {
        return {
            ...state,
            hasMoreNotes: false,
            loading: false,
            fetchFailed: false
        };
    }
    const nextRecordNumber = state.nextRecordNumber + titles.length;
    const notes = [...state.notes];
    notes.push(...titles);
    const hasMoreNote = titles.length < state.PAGE_SIZE ? false : true;
    return {
        ...state,
        notes: notes,
        loading: false,
        nextRecordNumber: nextRecordNumber,
        hasMoreNotes: hasMoreNote,
        fetchFailed: false
    };
};

/**
 * Function to add a new note (noteHeading and noteId) to the redux
 * Will be added to the beginning of the array
 * @param {Object} state
 * @param {Object} newNote - Contains noteId and noteHeading
 * @returns {Object} - Updated state with newly added note heading
 */
const addNote = (state, newNote) => {
    let notes = [];
    const nextRecordNumber = state.nextRecordNumber + 1;
    const note = {
        noteId: newNote.noteId,
        noteHeading: newNote.noteHeading
    };
    notes.push(note);
    notes.push(...state.notes);
    return {
        ...state,
        notes: notes,
        fetchFailed: false,
        nextRecordNumber: nextRecordNumber
    };
}

/**
 * Function to delete the note with the specified note id
 * @param {Object} state 
 * @param {String} noteId - Note id 
 * @returns {Object} - Updated state after removing the specified note.
 */
const deleteNote = (state, noteId) => {
    const notes = state.notes.filter(note => note.noteId !== noteId);
    const nextRecordNumber = state.nextRecordNumber - 1;
    return {
        ...state,
        notes: notes,
        fetchFailed: false,
        nextRecordNumber: nextRecordNumber
    };
}

const clearNotes = (state) => {
    return {
        ...state,
        notes: [],
        nextRecordNumber: 0,
        hasMoreNotes: true,
        loading: false,
        fetchFailed: false
    };
}




export default reducer;
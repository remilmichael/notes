import * as actionTypes from '../actions/actionTypes';
// import { updateObject } from '../../utility';

const initialState = {
    notes: [],
    fetchStarted: false,
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SAVE_NOTES_LIST:
            return pushNote(state, action.payload);
        case actionTypes.SAVE_NOTE_REDUX:
            return addNote(state, action.payload)
        case actionTypes.UPDATE_NOTE_REDUX:
            return updateNote(state, action.payload);
        case actionTypes.DELETE_NOTE_REDUX:
            return deleteNote(state, action.payload);
        case actionTypes.CLEAR_NOTE_REDUX:
            return clearNotes(state);
        default:
            return state;
    }
}

const clearNotes = (state) => {
    return {
        ...state,
        notes: []
    };
}

const deleteNote = (state, noteId) => {
    const notes = state.notes.filter(note => note.noteId !== noteId);
    return {
        ...state,
        notes: notes
    };
}

const updateNote = (state, updatedNote) => {
    state.notes.forEach((note) => {
        if (note.noteId === updatedNote.noteId) {
            note.noteHeading = updatedNote.noteHeading;
        }
    });
    return state;
}

const addNote = (state, newNote) => {
    let notes = [];
    const note = {
        noteId: newNote.noteId,
        noteHeading: newNote.noteHeading
    };
    notes.push(note);
    notes.push(...state.notes);
    return {
        ...state,
        notes: notes
    };
}

const pushNote = (state, titles) => {
    return {
        ...state,
        notes: titles
    };
};

export default reducer;
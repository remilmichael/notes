import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility';

const initialState = {
    notes: [],
    currentPage: 1,
    hasMoreNotes: true,
    loading: false,
    PAGE_SIZE: 10 //FIXED
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
        case actionTypes.FETCH_MORE_NOTES_START:
            return updateObject(state, {loading: true});
        case actionTypes.FETCH_NOTES_TITLES_FAILED:
            return updateObject(state, {loading: false});
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

    if (titles.length === 0 ) {
        return {
            ...state,
            hasMoreNotes: false,
            loading: false
        };
    }

    const notes = [...state.notes];
    notes.push(...titles);
    const currentPage = state.currentPage + 1;
    const hasMoreNote = titles.length < state.PAGE_SIZE ? false : true;
    return {
        ...state,
        notes: notes,
        loading: false,
        currentPage: currentPage,
        hasMoreNotes: hasMoreNote
    };
};

export default reducer;
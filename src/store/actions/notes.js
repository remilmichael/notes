import * as actions from './actionTypes';
import axios from '../../axios-notes';

export const dbActionStart = () => {
    return {
        type: actions.DB_ACTION_START
    };
}

export const dbActionSuccess = () => {
    return {
        type: actions.DB_ACTION_SUCCESS,
    };
}

export const dbActionFailed = (error) => {
    return {
        type: actions.DB_ACTION_FAILED,
        error: error
    };
}

export const saveNoteRedux = (note) => {
    return {
        type: actions.SAVE_NOTE_REDUX,
        payload: note
    };
}

export const saveNote = (note, idToken) => {
    return dispatch => {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };

        dispatch(dbActionStart());
        axios.post('/notes', note,{
                headers: headers
            })
            .then(() => {
                dispatch(saveNoteRedux(note));
                dispatch(dbActionSuccess());
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed("CHECK NETWORK CONNECTIVITY"));
                    console.log(error);
                }
            })
    }
}



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
                console.log(error);
                if (error.response) {
                    dispatch(dbActionFailed(error.response.data.message));
                } else {
                    dispatch(dbActionFailed("CHECK NETWORK CONNECTIVITY"));
                    console.log(error);
                }
            })
    }
}

export const updateNoteInRedux = (updatedNote) => {
    return {
        type: actions.UPDATE_NOTE_REDUX,
        payload: updatedNote
    }
}

export const deleteNoteFromRedux = (noteId) => {
    return {
        type: actions.DELETE_NOTE_REDUX,
        payload: noteId
    };
} 

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



export const resetToDefault = () => {
    return {
        type: actions.RESET_NOTE_STATE_DEFAULT
    }
}
import * as actions from './actionTypes';
import axios from '../../axios-notes';

export const fetchAllNotes = (idToken) => {
    return dispatch => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };
        axios.get('/notes', {
            headers: headers
        })
        .then((response) => {
            dispatch(fetchTitlesSuccess(response.data))
        })
        .catch(error => {
            console.log(error);
        });
    }
}


export const fetchTitlesSuccess = (titles) => {
    return {
        type: actions.SAVE_NOTES_LIST,
        payload: titles
    }
}

export const clearTitles = () => {
    return {
        type: actions.CLEAR_NOTE_REDUX
    }
};
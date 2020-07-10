import * as actions from './actionTypes';
import axios from '../../axios-notes';

export const fetchAllNotes = (idToken, page) => {
    return dispatch => {
        dispatch(fetchMoreTitleStart());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };
        axios.get('/notes/page/' + page, {
            headers: headers
        })
        .then((response) => {
            dispatch(fetchTitlesSuccess(response.data))
        })
        .catch(error => {
            dispatch(fetchTitlesFailed());
            console.log(error);
        });
    }
}

export const fetchTitlesFailed = () => {
    return {
        type: actions.FETCH_NOTES_TITLES_FAILED
    };
}

export const fetchMoreTitleStart = () => {
    return {
        type: actions.FETCH_MORE_NOTES_START
    };
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
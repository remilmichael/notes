import * as actions from '../actionTypes';
import axios from '../../../axios-notes';
import { RECORD_COUNT } from '../../reducers/notelist/notelist';

/**
 * Action creator to set the error message generated
 *      while trying to fetch notes
 * 
 * @function fetchTitlesFailed
 * @returns {Object} - Redux type
 */
export const fetchTitlesFailed = () => {
    return {
        type: actions.FETCH_NOTES_TITLES_FAILED
    };
}

/**
 * Action creator to start the spinner while 
 *      fetching note list
 * 
 * @function fetchMoreTitleStart
 * @returns {Object} - Redux type
 */
export const fetchMoreTitleStart = () => {
    return {
        type: actions.FETCH_MORE_NOTES_START
    };
}

/**
 * Action creator to update the fetch status
 *      to success and stop the spinner
 * 
 * @function fetchTitlesSuccess
 * @returns {Object} - Redux type and payload
 */
export const fetchTitlesSuccess = (titles) => {
    return {
        type: actions.SAVE_NOTES_LIST,
        payload: titles
    }
}

/**
 * Action creator to clear all fetched note list
 *      in redux, used when user logs out.
 * 
 * @function clearTitles
 * @returns {Object} - Redux type
 */
export const clearTitles = () => {
    return {
        type: actions.CLEAR_NOTE_REDUX
    }
};



/**
 * Function to fetch note titles from server
 * 
 * @function fetchAllNotes
 * @param {Number} page - Next record to fetch
 * @returns {Function}
 */
export const fetchAllNotes = (page) => {
    return dispatch => {
        dispatch(fetchMoreTitleStart());
        axios.get(`/notes/page/${page}/${RECORD_COUNT}`, {
            withCredentials: true
        })
            .then((response) => {
                if (response.data) {
                    dispatch(fetchTitlesSuccess(response.data))
                } else {
                    dispatch(fetchTitlesFailed());
                }

            })
            .catch(() => {
                dispatch(fetchTitlesFailed());
            });
    }
}


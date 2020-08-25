import * as actions from '../actionTypes';
import axios from '../../../axios-notes';
import { RECORD_COUNT } from '../../reducers/todolist/todolist';


/**
 * Action creator to set the error message generated
 *      while trying to fetch todos
 * 
 * @function fetchTitlesFailed
 * @returns {Object} - Redux type
 */
export const fetchTitlesFailed = () => {
    return {
        type: actions.FETCH_TODOS_TITLES_FAILED
    };
}

/**
 * Action creator to start the spinner while 
 *      fetching todos list
 * 
 * @function fetchMoreTitleStart
 * @returns {Object} - Redux type
 */
export const fetchMoreTitleStart = () => {
    return {
        type: actions.FETCH_MORE_TODOS_START
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
        type: actions.FETCH_TODOS_TITLES_SUCCESS,
        payload: titles
    }
}

/**
 * Function to fetch todo titles from server
 * 
 * @function fetchAllTodos
 * @param {String} idToken - JWT authentication token
 * @param {Number} page - Next record to fetch
 * @returns {Function}
 */
export const fetchAllTodos = (idToken, page) => {
    return dispatch => {
        dispatch(fetchMoreTitleStart());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
        };
        axios.get(`/todos/page/${page}/${RECORD_COUNT}`, {
            headers: headers
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

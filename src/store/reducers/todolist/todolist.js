import * as actionTypes from '../../actions/actionTypes';
import { updateObject } from '../../../utility';

/**
 * Number of todos to fetch on every request
 */
export const RECORD_COUNT = 10;

/**
 * Initial state of `todolist` reducer
 */

export const initialState = {
    todos: [], // [{todoId - String, todoTitle - String}]
    nextRecordNumber: 0,
    hasMoreTodos: true,
    loading: false,
    fetchFailed: false
}


/**
 * @function reducer - `todolist` reducer function
 * @param {Object} state - State given to reducer
 * @param {Object} action - Consists of type and payload
 */

export const reducer = (state = initialState, action) => {
    switch (action.type) {

        default:
            throw new Error("Unknown action")
    }
}
import React from 'react';
import * as actions from './actions';

/**
 * Initial state of the reducer
 * 
 * @property {Array} todos - Todos list
 * @property {Boolean} loading - For spinner
 * @property {Boolean} saveSuccessful - To redirect after successful submission
 * @property {String} error - Error message generated
 * @property {String} errorType - Type error message { warning, error }
 * @property {String} fetchTodoId - Existing todo id fetched from database
 * @property {String} fetchTodoTitle - Existing todo title fetched from database
 * @property {String} todos.item - Todo name
 * @property {Boolean} todos.strike - Indicates whether todo is striked
 * @property {Number} todos.index - Index of the item
 */
export const initialState = {
    todos: [], // contains { item: string, strike: boolean, index: number},
    loading: false,
    saveSuccessful: false,
    error: null,
    errorType: null,
    fetchTodoId: null,
    fetchTodoTitle: null
}

/**
 * Reducer function for TodoEditor
 * 
 * @function reducer
 * @param {Object} state - State given to the reducer
 * @param {Object} action - type and payload
 * @returns {Object} - Updated state
 */
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.APPEND_ITEM:
            return addItem(state, action.payload);
        case actions.DELETE_ITEM:
            return deleteItem(state, action.payload);
        case actions.CHANGE_STRIKE_STATE:
            return changeStrikeState(state, action.payload);
        case actions.DELETE_MULTIPLE_ITEMS:
            return deleteMultipleItems(state, action.payload);
        case actions.SAVE_CHANGES:
            return updateTodo(state, action.payload);
        case actions.SET_ERROR:
            return setError(state, action.payload);
        case actions.UNSET_ERROR:
            return { ...state, error: null, errorType: null };
        case actions.SAVE_TO_DB_START:
            return { ...state, loading: true };
        case actions.SAVE_TO_DB_SUCCESS:
            return { ...state, loading: false, saveSuccessful: true };
        case actions.SAVE_TO_DB_FAILED:
            return { ...state, loading: false, saveSuccessful: false };
        case actions.INIT_SPINNER:
            return { ...state, loading: true };
        case actions.FETCH_FROM_DB_SUCCESS:
            return saveToState(state, action.payload);
        case actions.STOP_SPINNER:
            return { ...state, loading: false };
        default:
            throw new Error('Unknown action type');
    }
}

/**
 * Function to call `useReducer` hook.
 * 
 * @function useApiCallReducer
 * @returns {Array} - state and dispatch function
 */
export function useApiCallReducer() {
    return React.useReducer(reducer, initialState);
}

/**
 * Function to add a new item into the todo list
 * 
 * @function addItem
 * @param {Object} state - current state
 * @param {Object} payload - new todo item
 * @return {Object} - updated state
 */
const addItem = (state, payload) => {

    const todos = [...state.todos];
    todos.push(payload);
    return {
        ...state,
        todos: todos,
    };
}

/**
 * Function to delete an exisiting item from the todo list
 * 
 * @function deleteItem
 * @param {Object} state - current state
 * @param {Number} index - index of the todo item
 * @return {Object} - updated state
 */
const deleteItem = (state, index) => {
    let indexCounter = 0;
    const newTodos = [];

    state.todos.filter(item => {
        if (index !== item.index) {
            newTodos.push({ ...item, index: indexCounter++ });
            return true;
        }
        return false;
    });

    return {
        ...state,
        todos: newTodos
    };
}

/**
 * 
 * @param {Object} state - current state
 * @param {Number} index - index to change strike status
 * @returns {Object} - updated state
 */
const changeStrikeState = (state, index) => {
    const newTodos = state.todos.map(item => {
        if (item.index === index) {
            const newItem = Object.assign({}, item);
            newItem.strike = !newItem.strike;
            return newItem;
        }
        return item;
    });
    return {
        ...state,
        todos: newTodos
    };
}

/**
 * 
 * @param {Object} state - current state
 * @param {Set} set - Set of indexes (as string) to delete
 * @returns {Object} - updated state
 */
const deleteMultipleItems = (state, set) => {
    const tempSet = new Set(set);
    let indexCounter = 0;
    const newTodos = [];
    state.todos.filter(item => {
        if (tempSet.has(item.index.toString())) {
            tempSet.delete(item.index.toString());
            return false;
        }
        newTodos.push({ ...item, index: indexCounter++ });
        return true;
    });

    return {
        ...state,
        todos: newTodos,
    };
}

/**
 * Function to update the changes made to the todo item
 * 
 * @function updateTodo
 * @param {Object} state - current state
 * @param {Object} payload - index and updated todo
 * @property {Number} payload.index - index of the updated todo
 * @property {String} payload.value - updated todo
 * @returns {Object} - updated state
 */
const updateTodo = (state, payload) => {
    const updatedTodos = state.todos.map(todoItem => {
        if (todoItem.index === payload.index) {
            return { ...todoItem, item: payload.value }
        }
        return todoItem;
    });
    return {
        ...state,
        todos: updatedTodos
    };
}

/**
 * Function to set an error with its type
 * 
 * @function setError
 * @param {Object} state - current state
 * @param {Object} payload - Error message and its type
 * @returns {Object} - updated state
 */
const setError = (state, payload) => {
    return {
        ...state,
        error: payload.error,
        errorType: payload.errorType
    };
}

/**
 * Function to update the state with fetched todos
 *      from database
 * 
 * @function saveToState
 * @param {Object} state - current state
 * @param {Object} payload - Fetched todos and it's id
 * @returns {Object} - updated state
 */
const saveToState = (state, payload) => {
    const todos = payload.todos;
    const sortedTodos = todos.sort((todo1, todo2) => {
        return todo1.index - todo2.index;
    })

    const updatedState = {
        ...state,
        loading: false,
        fetchTodoId: payload.todoId,
        fetchTodoTitle: payload.todoTitle,
        todos: sortedTodos
    };

    return updatedState;
}

export default reducer;
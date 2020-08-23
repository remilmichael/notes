import React from 'react';
import * as actions from './actions';

/**
 * Initial state of the reducer
 * 
 * @property {Array} todos - Todos list
 * @property {String} todos.item - Todo name
 * @property {Boolean} todos.strike - Indicates whether todo is striked
 * @property {Number} todos.index - Index of the item
 */
export const initialState = {
    todos: [], // contains { item: string, strike: boolean, index: number}
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
    switch(action.type) {
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
            newTodos.push({...item, index: indexCounter++});
            return true;
        }
        return false;
    });

    return {
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
            const newItem =  Object.assign({}, item);
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
        newTodos.push({...item, index: indexCounter++});
        return true;
    });

    return {
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
            return { ...todoItem, item: payload.value}
        }
        return todoItem;
    });
    return {
        todos: updatedTodos
    };
}

export default reducer;
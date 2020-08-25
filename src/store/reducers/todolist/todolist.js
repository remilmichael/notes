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
        case actionTypes.FETCH_TODOS_TITLES_SUCCESS:
            return pushTodos(state, action.payload);
        case actionTypes.SAVE_TODO_REDUX:
            return addTodo(state, action.payload);
        case actionTypes.UPDATE_TODO_REDUX:
            return updateTodo(state, action.payload);
        case actionTypes.DELETE_TODO_REDUX:
            return deleteTodo(state, action.payload);
        case actionTypes.CLEAR_TODO_REDUX:
            return clearTodos();
        case actionTypes.FETCH_MORE_TODOS_START:
            return updateObject(state, { loading: true });
        case actionTypes.FETCH_TODOS_TITLES_FAILED:
            return updateObject(state, { loading: false, fetchFailed: true });
        default:
            return state;
    }
};

/**
 * Function to store all fetched todos titles from the server
 * 
 * @function pushTodos
 * @param {Object} state 
 * @param {Array} titles 
 * @returns {Object}
 */
const pushTodos = (state, titles) => {
    if (titles.length === 0) {
        return {
            ...state,
            hasMoreTodos: false,
            loading: false,
            fetchFailed: false
        };
    }
    const nextRecordNumber = state.nextRecordNumber + titles.length;
    const todos = [...state.todos];
    todos.push(...titles);
    const hasMoreTodos = titles.length < RECORD_COUNT ? false : true;

    return {
        ...state,
        todos: todos,
        loading: false,
        nextRecordNumber: nextRecordNumber,
        hasMoreTodos: hasMoreTodos,
        fetchFailed: false
    };
}

/**
 * Function to add a new todo title (todoId and todoTitle) to the redux.
 * Since it's last modified todo, it'll be added to the beginning.
 * 
 * @function addTodo
 * @param {Object} state
 * @param {Object} newTodo - Contains todoId and todoTitle
 * @returns {Object} - Updated state with newly added todo heading
 */
const addTodo = (state, newTodo) => {
    const todos = [];
    const nextRecordNumber = state.nextRecordNumber + 1;
    const todo = {
        todoId: newTodo.todoId,
        todoTitle: newTodo.todoTitle
    };
    todos.push(todo);
    todos.push(...state.todos);
    return {
        ...state,
        todos: todos,
        fetchFailed: false,
        nextRecordNumber: nextRecordNumber
    };
}

/**
 * Function to update the reducer with updated todo
 * 
 * @function updateTodo
 * @param {Object} state 
 * @param {Object} todo 
 */
const updateTodo = (state, todo) => {
    const todos = [];
    todos.push({ todoId: todo.todoId, todoTitle: todo.todoTitle });
    const otherTodos = state.todos.filter((item) => {
        return item.todoId !== todo.todoId;
    });

    todos.push(...otherTodos);
    return {
        ...state,
        todos: todos
    };
}

/**
 * Function to delete todo with the specified todo id
 * 
 * @function deleteTodo
 * @param {Object} state 
 * @param {String} todoId - Todo id 
 * @returns {Object} - Updated state after removing the specified todo.
 */
const deleteTodo = (state, todoId) => {
    const todos = state.todos.filter(todo => todo.todoId !== todoId);
    const nextRecordNumber = state.nextRecordNumber - 1;
    return {
        ...state,
        todos: todos,
        fetchFailed: false,
        nextRecordNumber: nextRecordNumber
    };
}

/**
 * Function to reset to initial state
 * 
 * @function clearTodos
 * @param {Object} state 
 * @returns {Object} - Initial state
 */
const clearTodos = () => {
    return initialState;
}

export default reducer;
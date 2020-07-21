import { useReducer } from 'react';
import * as actions from './actions';

const initialState = {
    todos: [], // contains { item: string, strike: boolean, index: number}
    nextIndex: 0
}

const reducer = (state, action) => {
    switch(action.type) {
        case actions.APPEND_ITEM:
            return addItem(state, action.payload);
        case actions.DELETE_ITEM:
            return deleteItem(state, action.payload);
        case actions.CHANGE_STRIKE_STATE:
            return changeStrikeState(state, action.payload);
        default:
            return state;
    }
}

export function useApiCallReducer() {
    return useReducer(reducer, initialState);
}

const addItem = (state, payload) => {

    const todos = [...state.todos];
    todos.push(payload);
    const nextIndex = state.nextIndex + 1;
    return {
        ...state,
        todos: todos,
        nextIndex: nextIndex
    };
}

const deleteItem = (state, index) => {
    
    const newTodos = state.todos.filter(item => {
        return item.index !== index;
    });

    return {
        ...state,
        todos: newTodos,
    };
    
}

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

export default reducer;
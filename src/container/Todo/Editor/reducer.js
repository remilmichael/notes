import React from 'react';
import * as actions from './actions';

const reducer = (state, action) => {
    switch(action.type) {
        case actions.APPEND_ITEM:
            return addItem(state, action.payload);
        default:
            return state;
    }
}

const addItem = (state, payload) => {
    const todos = state.todos;
    todos.push(payload);
    const nextIndex = state.nextIndex + 1;
    return {
        ...state,
        todos: todos,
        nextIndex: nextIndex
    };
}

export default reducer;
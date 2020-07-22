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
        case actions.DELETE_MULTIPLE_ITEMS:
            return deleteMultipleItems(state, action.payload);
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
    
    let indexCounter = 0;

    const newTodos = state.todos.filter(item => {
        return item.index !== index;
    });

    console.log(newTodos);
    
    newTodos.forEach(item => {
        item.index = indexCounter++;
    });
    
        
    
    return {
        ...state,
        todos: newTodos,
        nextIndex: indexCounter
    };
    
}

const deleteMultipleItems = (state, set) => {
    
    // copied 'set' since mutating the original 'set' causes the
    // TodoEditor.js to re-render.
    const tempSet = new Set(set); 

    let indexCounter = 0;
    const tempArray = [...state.todos];

    const newTodos = tempArray.filter((item) => {
        if (tempSet.has(item.index.toString())) {
            tempSet.delete(item.index.toString());
            return false;
        }
        item.index = indexCounter++;
        return true;
    });
    
    return {
        ...state,
        todos: newTodos,
        nextIndex: indexCounter
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
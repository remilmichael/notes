import * as actionTypes from './actions';
import { initialState, reducer } from './reducer';

const updatedInitialState = {
    todos: [
        { item: 'Todo 1', strike: false, index: 0 },
        { item: 'Todo 2', strike: false, index: 1 },
        { item: 'Todo 3', strike: false, index: 2 },
        { item: 'Todo 4', strike: false, index: 3 }
    ],
}

describe('Appending items', () => {
    it('should add an item to the empty list', () => {
        const newTodo = { item: 'New todo item', strike: false, index: 0 };
        const receivedState = reducer(initialState, { type: actionTypes.APPEND_ITEM, payload: newTodo });
        const expectedState = {
            ...initialState,
            todos: [newTodo]
        }
        expect(receivedState).toEqual(expectedState);
    });

    it('should append a new item to exisiting list', () => {
        const newTodo = { item: 'Todo 5',
             strike: false,
             index: updatedInitialState.todos.length
        };
        const receivedState = reducer(updatedInitialState, { type: actionTypes.APPEND_ITEM, payload: newTodo });
        const expectedState = { 
            todos: [...updatedInitialState.todos, newTodo],
        };
        expect(receivedState).toEqual(expectedState);
    });
    
});

describe('Deleting todos from the list', () => {
    it('should delete the item from the list', () => {
        const indexToRemove = 2;
        const modifiedTodos = [
            { item: 'Todo 1', strike: false, index: 0 },
            { item: 'Todo 2', strike: false, index: 1 },
            { item: 'Todo 4', strike: false, index: 2 }
        ]
        const expectedState = {
            todos: modifiedTodos
        };
        const receivedState = reducer(updatedInitialState, { type: actionTypes.DELETE_ITEM, payload: indexToRemove });
        expect(receivedState).toEqual(expectedState);
    });
    it('should delete multiple items from list', () => {
        const set = new Set();
        set.add('0');
        set.add('3');

        const expectedState = {
            todos : [
                { item: 'Todo 2', strike: false, index: 0 },
                { item: 'Todo 3', strike: false, index: 1 },
            ]
        };
        const receivedState = reducer(updatedInitialState,
            { type: actionTypes.DELETE_MULTIPLE_ITEMS, payload: set });
        expect(receivedState).toEqual(expectedState);
    });
});

describe('Updating an existing todo', () => {
    it('should update the changes made to an item', () => {
        const indexToUpdate = 2;
        const modifiedTodo = 'This is todo 3';
        const receivedState = reducer(updatedInitialState,
            { type: actionTypes.SAVE_CHANGES,
                payload: { value: modifiedTodo, index: indexToUpdate } });
        const expectedState = {
            todos: [
                { item: 'Todo 1', strike: false, index: 0 },
                { item: 'Todo 2', strike: false, index: 1 },
                { item: modifiedTodo, strike: false, index: indexToUpdate },
                { item: 'Todo 4', strike: false, index: 3 }
            ]
        };
        expect(receivedState).toEqual(expectedState);
    });

    it('should `strike` the todo item with given index', () => {
        const indexToUpdate = 2;
        const expectedState = {
            todos: [
                { item: 'Todo 1', strike: false, index: 0 },
                { item: 'Todo 2', strike: false, index: 1 },
                { item: 'Todo 3', strike: true, index: 2 },
                { item: 'Todo 4', strike: false, index: 3 }
            ]
        };

        const receivedState = reducer(updatedInitialState,
            { type: actionTypes.CHANGE_STRIKE_STATE, payload: indexToUpdate });

        expect(receivedState).toEqual(expectedState);
    });

    it('should `unstrike` the todo item with given index', () => {
        const indexToUpdate = 2;
        const expectedState = updatedInitialState;

        const currentStatus = {
            todos: [
                { item: 'Todo 1', strike: false, index: 0 },
                { item: 'Todo 2', strike: false, index: 1 },
                { item: 'Todo 3', strike: true, index: 2 },
                { item: 'Todo 4', strike: false, index: 3 }
            ]
        };

        const receivedState = reducer(currentStatus,
            { type: actionTypes.CHANGE_STRIKE_STATE, payload: indexToUpdate });

        expect(receivedState).toEqual(expectedState);
    });
});

describe('Pushing note to the server', () => {
    it('should return state with `loading` to true', () => {
        const receivedState = reducer(initialState, { type: actionTypes.SAVE_TO_DB_START });
        const expectedState = {
            ...initialState,
            loading: true
        };
        expect(receivedState).toEqual(expectedState);
    });
});
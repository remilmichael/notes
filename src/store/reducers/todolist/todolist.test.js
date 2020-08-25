import * as actionTypes from '../../actions/actionTypes';
import { reducer, initialState } from './todolist';

const sampleTodos = [
    { todoId: '123', todoTitle: 'Title 1' },
    { todoId: '456', todoTitle: 'Title 2' },
    { todoId: '789', todoTitle: 'Title 3' },
    { todoId: '467', todoTitle: 'Title 4' },
    { todoId: 'abcd', todoTitle: 'Title 5' },
];

it('should return the previous state for any unknown action', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

describe('Testing actions in `todolist` reducer', () => {
    describe('action type `FETCH_TODOS_TITLES_SUCCESS`', () => {
        describe('When NO existing todo titles exists', () => {
            it('should return the updated state when NO new titles are received', () => {
                const emptyList = [];
                const receivedState = reducer(initialState,
                    { type: actionTypes.FETCH_TODOS_TITLES_SUCCESS, payload: emptyList });
                const expectedState = {
                    ...initialState,
                    hasMoreTodos: false,
                    loading: false,
                    fetchFailed: false
                };
                expect(receivedState).toEqual(expectedState);
            });

            it('should return the updated state when new titles are received', () => {
                const newRewReceivedTitles = [
                    sampleTodos[0],
                    sampleTodos[1]
                ];
                const receivedState = reducer(initialState,
                    { type: actionTypes.FETCH_TODOS_TITLES_SUCCESS, payload: newRewReceivedTitles });
                const expectedState = {
                    ...initialState,
                    nextRecordNumber: newRewReceivedTitles.length,
                    todos: newRewReceivedTitles,
                    hasMoreTodos: false
                };
                expect(receivedState).toEqual(expectedState);
            });

            it('should return updated state when 10 or more todo titles are received', () => {
                const newReceivedTitles = [
                    { todoId: '123', todoTitle: 'Title 1' },
                    { todoId: '456', todoTitle: 'Title 2' },
                    { todoId: '789', todoTitle: 'Title 2' },
                    { todoId: '467', todoTitle: 'Title 4' },
                    { todoId: 'abcd', todoTitle: 'Title 5' },
                    { todoId: '131', todoTitle: 'Title 6' },
                    { todoId: '454', todoTitle: 'Title 7' },
                    { todoId: '785', todoTitle: 'Title 8' },
                    { todoId: '4sdc7', todoTitle: 'Title 9' },
                    { todoId: 'an37dcb6', todoTitle: 'Title 10' },
                ];

                const receivedState = reducer(initialState,
                    { type: actionTypes.FETCH_TODOS_TITLES_SUCCESS, payload: newReceivedTitles });
                const expectedState = {
                    ...initialState,
                    todos: [...newReceivedTitles],
                    nextRecordNumber: newReceivedTitles.length,
                    hasMoreTodos: true,
                };
                expect(receivedState).toEqual(expectedState);
            });
        });

        describe('When there are existing titles in reducer', () => {
            const updatedInitialState = {
                ...initialState,
                todos: [...sampleTodos]
            };

            test('should return the updated state when NO new titles are received', () => {
                const emptyArray = [];
                const receivedState = reducer(updatedInitialState,
                    { type: actionTypes.FETCH_TODOS_TITLES_SUCCESS, payload: emptyArray });
                const expectedState = {
                    ...initialState,
                    todos: [...sampleTodos],
                    hasMoreTodos: false,
                    loading: false,
                    fetchFailed: false
                };
                expect(receivedState).toEqual({ ...initialState, ...expectedState });
            });

            test('should return the updated state when new titles are received', () => {
                const newReceivedTodos = [
                    { todoId: 'xyz', todoTitle: 'Title new 1' },
                    { todoId: 'lmn', todoTitle: 'Test title new 2' }
                ];
                const receivedState = reducer(updatedInitialState,
                    { type: actionTypes.FETCH_TODOS_TITLES_SUCCESS, payload: newReceivedTodos });
                const expectedState = {
                    ...initialState,
                    nextRecordNumber: newReceivedTodos.length,
                    todos: [...sampleTodos, ...newReceivedTodos],
                    hasMoreTodos: false
                }
                expect(receivedState).toEqual(expectedState);
            });
        });
    });

    describe('action type `SAVE_TODO_REDUX`', () => {
        describe('When no titles exists', () => {
            test('should return the updated state when a new title is added', () => {
                const payload = { todoId: 'id234', todoTitle: 'Sample todo title' };
                const receivedState = reducer(initialState,
                    { type: actionTypes.SAVE_TODO_REDUX, payload: payload });
                const expectedState = {
                    ...initialState,
                    todos: [payload],
                    nextRecordNumber: initialState.nextRecordNumber + 1
                }
                expect(receivedState).toEqual(expectedState);
            });
        });

        describe('When some titles already exists', () => {
            test('should add new title to beginning of the array', () => {
                const updatedState = {
                    ...initialState,
                    todos: [...sampleTodos], nextRecordNumber: sampleTodos.length
                };
                const payload = { todoId: 'id234', todoTitle: 'Sample todo title' };
                const receivedState = reducer(updatedState,
                    { type: actionTypes.SAVE_TODO_REDUX, payload: payload });
                const expectedState = {
                    ...initialState,
                    todos: [payload, ...sampleTodos],
                    nextRecordNumber: sampleTodos.length + 1
                }
                expect(receivedState).toEqual(expectedState);
            });
        });
    });

    describe('action type `DELETE_TODO_REDUX`', () => {
        test('should return the updated state after a todo is deleted from redux store', () => {
            const updatedState = {
                ...initialState,
                todos: [...sampleTodos],
                nextRecordNumber: sampleTodos.length
            };
            const todoIdToDelete = 'abcd';
            const receivedState = reducer(updatedState,
                { type: actionTypes.DELETE_TODO_REDUX, payload: todoIdToDelete });
            const updatedTodos = sampleTodos.filter(todo => {
                return todo.todoId !== todoIdToDelete;
            })
            const expectedState = {
                ...initialState,
                todos: [...updatedTodos],
                nextRecordNumber: sampleTodos.length - 1
            }
            expect(receivedState).toEqual(expectedState);
        });
    });

    describe('action type `UPDATE_TODO_REDUX` - Put updated todo to the beginning', () => {
        it('should return the updated todos list after a todo has been updated', () => {
            const updatedState = {
                ...initialState,
                todos: [...sampleTodos],
                nextRecordNumber: sampleTodos.length
            };

            const todoIdToUpdate = '467';
            const receivedState = reducer(updatedState,
                { type: actionTypes.UPDATE_TODO_REDUX, payload: sampleTodos[3] });
            const todos = sampleTodos.filter(todo => {
                return todo.todoId !== todoIdToUpdate;
            });
            todos.unshift(sampleTodos[3]); // updated todo is in index 3, pushed to beginning
            const expectedState = {
                ...initialState,
                todos: todos,
                nextRecordNumber: sampleTodos.length
            };
            expect(receivedState).toEqual(expectedState);
        });
    });

    describe('action type `CLEAR_TODO_REDUX`', () => {
        it('should return the initialState', () => {
            const updatedState = {
                ...initialState,
                todos: [...sampleTodos],
                nextRecordNumber: sampleTodos.length
            };
            const receivedState = reducer(updatedState,
                { type: actionTypes.CLEAR_TODO_REDUX });
            expect(receivedState).toEqual(initialState);
        });
    });

    describe('action type `FETCH_MORE_TODOS_START`', () => {
        it('should return the updated state with `loading` set to `true`', () => {
            const expectedState = {
                ...initialState,
                loading: true
            };
            const receivedState = reducer(initialState,
                { type: actionTypes.FETCH_MORE_TODOS_START });
            expect(receivedState).toEqual(expectedState);
        });
    });

    describe('action type `FETCH_TODOS_TITLES_FAILED`', () => {
        it('should update state with `loading` set to `false` and `fetchFailed` to `true`', () => {
            const expectedState = {
                ...initialState,
                loading: false,
                fetchFailed: true
            }
            const receivedState = reducer(initialState,
                { type: actionTypes.FETCH_TODOS_TITLES_FAILED });
            expect(receivedState).toEqual(expectedState);
        });
    });
});
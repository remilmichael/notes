import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import TodoViewer from './TodoViewer';
import { initialState as todolistInitialState } from '../../../store/reducers/todolist/todolist';
import { storeFactory, authInitialState } from '../../../testUtils';

const authUpdatedState = {
    ...authInitialState,
    idToken: "sampleToken123",
    userId: "id123",
    expiresOn: new Date(),
};

const todos = [
    { todoId: 'id1254', todoTitle: 'Sample title 1' },
    { todoId: 'id1345', todoTitle: 'Sample title 2' },
    { todoId: 'id1743', todoTitle: 'Sample title 3' },
    { todoId: 'id1931', todoTitle: 'Sample title 4' },
]

const updatedTodolist = {
    todos: todos,
    nextRecordNumber: 4,
    hasMoreTodos: false,
    loading: false,
    fetchFailed: false
}

let history = createMemoryHistory();

/**
 * Factory function to render the `TodoViewer` component
 *      and to pass custom props to it.
 * 
 * @function setup
 * @param {Object} todolistProp - Updated todolist reducer state.
 * 
 */
const setup = (todolistProp = updatedTodolist) => {
    history = createMemoryHistory();
    const store = storeFactory();
    store.getState().auth = authUpdatedState;
    store.getState().todolist = todolistProp;
    render(
        <Provider store={store}>
            <Router history={history}>
                <TodoViewer />
            </Router>
        </Provider>
    );
}


describe("Accessing TodoViewer without logging in", () => {
    const history = createMemoryHistory();

    it("should redirect to `/login`", () => {
        const store = storeFactory();
        render(
            <Provider store={store}>
                <Router history={history}>
                    <TodoViewer />
                </Router>
            </Provider>
        );
        expect(history.location.pathname).toEqual("/login");
        expect(history.action).toEqual('PUSH');
    });
});

describe('Accessing TodoViewer with valid credentials', () => {

    const server = setupServer(
        rest.get('*', (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                ctx.json({})
            );
        })
    )

    it('should render a spinner', async () => {
        server.listen();
        const store = storeFactory();
        store.getState().auth = authUpdatedState;
        render(
            <Provider store={store}>
                <Router history={history}>
                    <TodoViewer />
                </Router>
            </Provider>
        );
        await waitFor(() => {
            expect(screen.queryByText(/Loading/)).toBeTruthy();
        })
        server.close();
    });

    it('should render the todo titles', () => {
        setup();
        expect(screen.queryAllByTestId(/todo-title-/).length).toBe(todos.length);
    });

    it('should render the disabled button with failure message `Failed to connect` when fetch fails', () => {
        const todolistProp = {
            ...todolistInitialState,
            fetchFailed: true
        };
        setup(todolistProp);
        expect(screen.queryByText('Failed to connect')).toBeTruthy();
    });

    it('should render the `Load more` button to load more todos from server', () => {
        const todolistProp = {
            ...todolistInitialState,
            todos: todos,
            hasMoreTodos: true,
            nextRecordNumber: todos.length,
        };
        setup(todolistProp);
        expect(screen.queryByText('Load more')).toBeTruthy();
    });

    it('should not render `Load more` or `Spinner` or `Disabled button`', () => {
        const todolistProp = {
            ...todolistInitialState,
            todos: todos,
            hasMoreTodos: false,
            nextRecordNumber: todos.length
        }
        setup(todolistProp);
        expect(screen.queryByText(/Load more/)).toBeFalsy();
        expect(screen.queryByText(/Failed/)).toBeFalsy();
        expect(screen.queryByText(/Loading/)).toBeFalsy();
    });
})

describe('Testing `New todo` button', () => {
    it('should render `New Todo` button', () => {
        setup();
        expect(screen.queryByText('New Todo')).toBeTruthy();
    });

    it('clicking the todo button', () => {
        setup();
        fireEvent.click(screen.queryByText('New Todo'));
        expect(history.location.pathname).toEqual('/todo');
        expect(history.action).toEqual('PUSH');
    });
});

import React from 'react'
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import TodoEditor from './TodoEditor'
import { storeFactory, authInitialState } from '../../../testUtils';
import { ROOT_URL } from '../../../utility';

const sampleTodos = [
    'This is todo task 0',
    'This is todo task 1',
    'This is todo task 2',
    'This is todo task 3',
    'This is todo task 4'
];

const sampleFetchResponse = {
    todoId: 'ce28159b-e2cf-43d8-892c-ac15af89cf43',
    todoTitle: 'Sample title',
    username: 'foo',
    lastUpdated: '1597731817123',
    todoItems: [
        {
            todoIndex: 0,
            todoItem: 'Item 1',
            strike: false
        },
        {
            todoIndex: 1,
            todoItem: 'Item 2',
            strike: false
        },
        {
            todoIndex: 2,
            todoItem: 'Item 3',
            strike: false
        },
    ]
}

const authUpdatedState = {
    ...authInitialState,
    idToken: 'sampleToken123',
    userId: 'id123',
    expiresOn: new Date()
}

let history, store;
const setup = () => {
    history = createMemoryHistory()
    store = storeFactory()
    store.getState().auth = authUpdatedState
    render(
        <Provider store={store}>
            <Router history={history}>
                <TodoEditor />
            </Router>
        </Provider>
    );
}
const setupWithHistoryProps = () => {
    history = createMemoryHistory();
    history.location.search = '?id=ce28159b-e2cf-43d8-892c-ac15af89cf43';
    store = storeFactory();
    store.getState().auth = authUpdatedState;
    render(
        <Provider store={store}>
            <Router history={history}>
                <TodoEditor />
            </Router>
        </Provider>
    );
};

jest.useFakeTimers()

describe('Accessing TodoEditor without logging in', () => {
    const history = createMemoryHistory()

    it('should redirect to `/login`', () => {
        const store = storeFactory()
        render(
            <Provider store={store}>
                <Router history={history}>
                    <TodoEditor />
                </Router>
            </Provider>
        )
        expect(history.location.pathname).toEqual('/login')
    })

    it('should redirect to `/login` with url params', () => {
        const store = storeFactory()
        history.location.search = '?id=ce28159b-e2cf-43d8-892c-ac15af89cf43';
        render(
            <Provider store={store}>
                <Router history={history}>
                    <TodoEditor />
                </Router>
            </Provider>
        )
        expect(history.location.pathname).toEqual('/login');
        expect(history.location.search).toEqual(`?redirect=todo?id=${sampleFetchResponse.todoId}`)
    });
})

test('should redirect to `TodoViewer`', () => {
    setup();
    fireEvent.click(screen.queryByText('Cancel'));
    expect(history.location.pathname).toEqual('/todoviewer')
    expect(history.action).toEqual('PUSH')
})


describe('Rendering TodoEditor component', () => {
    it('should render Input field and `Add` button and NO todo list table  ', () => {
        setup()
        const containerComponent = screen.queryByTestId('component-container')
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const tableComponent = screen.queryByRole('table', { name: 'todo-list' })
        const addButton = screen.queryByText('Add')

        expect(containerComponent).not.toBeNull()
        expect(newItemInput).not.toBeNull()
        expect(addButton).not.toBeNull()

        // no todo list since it's empty
        expect(tableComponent).toBeNull()
    })

    it('should render `Save`, `Delete` and `Cancel` buttons and `Title` textfield', () => {
        setup()
        expect(screen.queryByRole('button', { name: 'action-save' })).toBeTruthy()
        expect(
            screen.queryByRole('button', { name: 'action-delete' })
        ).toBeTruthy()
        expect(
            screen.queryByRole('button', { name: 'action-cancel' })
        ).toBeTruthy()

        expect(screen.queryByRole('textbox', { name: 'todo-title' })).toBeTruthy()
    })
})

describe('Adding todos', () => {
    let newItemInput, addButton
    beforeEach(() => {
        setup()
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        addButton = screen.queryByText('Add')
        fireEvent.change(newItemInput, { target: { value: sampleTodos[0] } })
        fireEvent.click(addButton)
    })

    it('Adding a single todo', () => {
        // Check for a checkbox before the item
        expect(screen.queryByRole('checkbox', { name: 'checkbox' })).toBeTruthy()

        // Check if newly added item exists in the list
        expect(screen.queryByText(sampleTodos[0])).toBeTruthy()

        // Check if edit icon is shown next to the todo item
        expect(screen.queryByTestId('edit-icon-0')).toBeTruthy()

        // Check if trash icon is shown next to the edit icon
        expect(screen.queryByTestId('trash-icon-0')).toBeTruthy()
    })

    it('Adding multiple todos ', () => {
        // Adding todos 1,2,3 along with 0
        for (let i = 1; i <= 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }

        // Check if all todos were added
        expect(screen.queryAllByText(/This is todo task/).length).toBe(4)

        // Check if items are displayed in order with respect to its index
        expect(screen.queryByText(sampleTodos[0]).firstChild).toBe(
            screen.queryByTestId('todo-item-0').firstChild
        )
        expect(screen.queryByText(sampleTodos[1]).firstChild).toBe(
            screen.queryByTestId('todo-item-1').firstChild
        )
        expect(screen.queryByText(sampleTodos[2]).firstChild).toBe(
            screen.queryByTestId('todo-item-2').firstChild
        )
        expect(screen.queryByText(sampleTodos[3]).firstChild).toBe(
            screen.queryByTestId('todo-item-3').firstChild
        )
    })
})

describe('Editing an existing todo - todo 1', () => {
    let newItemInput, addButton
    beforeEach(() => {
        setup()
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        addButton = screen.queryByText('Add')
        // Adding two todos
        for (let i = 0; i < 2; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
        fireEvent.click(screen.getByTestId('edit-icon-1'))
    })

    it('should render a textfield replacing the clicked todo', () => {
        // A textfield must show replacing the editing todo item
        expect(
            screen.queryByRole('textbox', { name: 'edit-todo-tf-1' })
        ).toBeTruthy()

        // No other textfields are rendered in the table
        expect(
            screen.queryByRole('textbox', { name: 'edit-todo-tf-0' })
        ).toBeFalsy()
    })

    it('should render `tick` and `cancel` icon aside of textfield', () => {
        // `Tick` icon is rendered instead of `Edit` icon
        expect(screen.queryByTestId('tick-mark-icon-1')).toBeTruthy()
        expect(screen.queryByTestId('edit-icon-1')).toBeFalsy()

        // `Cancel` icon is rendered instead of `Trash` icon
        expect(screen.queryByTestId('cancel-icon-1')).toBeTruthy()
        expect(screen.queryByTestId('trash-icon-1')).toBeFalsy()
    })

    describe('Updating item', () => {
        const updatedTodo = 'This is an updated todo item'
        const updatingIndex = 1

        beforeEach(() => {
            const editTextfield = screen.queryByRole('textbox', {
                name: `edit-todo-tf-${updatingIndex}`
            })
            fireEvent.change(editTextfield, { target: { value: updatedTodo } })
        })

        it('should update the existing todo item', () => {
            fireEvent.click(screen.queryByTestId(`tick-mark-icon-${updatingIndex}`))

            expect(screen.queryByText(updatedTodo)).toEqual(
                screen.queryByTestId(`todo-item-${updatingIndex}`)
            )
        })

        it('should discard the changes made to the todo item', () => {
            fireEvent.click(screen.queryByTestId(`cancel-icon-${updatingIndex}`))
            expect(screen.queryByText(updatedTodo)).toBeFalsy()
            expect(screen.queryByTestId(`todo-item-${updatingIndex}`)).toEqual(
                screen.getByText(sampleTodos[updatingIndex])
            )
        })
    })
})

describe('Deleting multiple todos', () => {
    let newItemInput, addButton
    beforeEach(() => {
        setup()
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        addButton = screen.queryByText('Add')
        for (let i = 0; i < sampleTodos.length; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
    })

    it('should render `delete button` when a checkbox is selected', () => {
        const randomCheckbox = screen.getByTestId('checkbox-1')
        fireEvent.click(randomCheckbox)
        // Check if checkbox is selected
        expect(randomCheckbox.checked).toEqual(true)
        expect(
            screen.queryByRole('button', { name: 'delete-multiple-todos' })
        ).toBeTruthy()
    })

    it('should delete the selected todos from list when clicked`delete button`', () => {
        fireEvent.click(screen.getByTestId('checkbox-1'))
        fireEvent.click(screen.getByTestId('checkbox-2'))
        fireEvent.click(screen.getByTestId('checkbox-4'))

        // delete todos 1,2,4
        fireEvent.click(
            screen.queryByRole('button', { name: 'delete-multiple-todos' })
        )

        expect(screen.queryByText(sampleTodos[1])).toBeFalsy()
        expect(screen.queryByText(sampleTodos[2])).toBeFalsy()
        expect(screen.queryByText(sampleTodos[4])).toBeFalsy()

        expect(screen.queryByText(sampleTodos[0])).toBeTruthy()
        expect(screen.queryByText(sampleTodos[3])).toBeTruthy()
    })
})

describe('Deleting a single item', () => {
    beforeEach(() => {
        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 2; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
    })
    it('should delete first item - index 0', () => {
        const indexToDelete = 0
        const trashIcon = screen.getByTestId(`trash-icon-${indexToDelete}`)
        fireEvent.click(trashIcon)

        // second todo should now be the first todo.
        expect(screen.getByTestId(`todo-item-${indexToDelete}`)).toEqual(
            screen.getByText(sampleTodos[indexToDelete + 1])
        )
    })
})

describe('Striking and unstriking todos', () => {
    beforeEach(() => {
        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
    })

    it('should strike an existing todo item', () => {
        const strikingIndex = 2
        fireEvent.click(screen.getByTestId(`todo-item-${strikingIndex}`))
        expect(screen.queryByTestId(`striked-todo-${strikingIndex}`)).toBeTruthy()
        expect(
            screen.queryByTestId(`striked-todo-${strikingIndex - 1}`)
        ).toBeFalsy()
    })

    it('should unstrike an existing', () => {
        const strikingIndex = 2
        fireEvent.click(screen.getByTestId(`todo-item-${strikingIndex}`))
        fireEvent.click(screen.getByTestId(`todo-item-${strikingIndex}`))
        expect(screen.queryByTestId(`striked-todo-${strikingIndex}`)).toBeFalsy()
    })
})

// When using mock service worker put all async function which utlizes 
// the server inside a single `describe` to avoid unexpected errors.
describe('Saving and fetching to/from database', () => {
    const server = setupServer(
        rest.post(`${ROOT_URL}/todos`, (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.set({ 'Access-Control-Allow-Origin': '*' })
            )
        })
    )
    beforeAll(() => {
        server.listen()
    })

    afterAll(() => {
        server.close()
    })

    afterEach(() => {
        server.resetHandlers()
    })

    it('should render `Alert` with text `Nothing to save`', () => {
        setup()
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        expect(screen.queryByText('Nothing to save')).toBeTruthy()
    })

    it('should render `Alert` with text `Add title for todo`', () => {
        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        expect(screen.queryByText('Give a title for todo')).toBeTruthy()
    })

    it('`Alert` must disappear after three seconds', async () => {
        setup()
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        await waitFor(() => {
            expect(screen.queryByText('Nothing to save')).toBeFalsy()
        })
    })

    it('should render the `Spinner` component', () => {
        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
        fireEvent.change(screen.queryByRole('textbox', { name: 'todo-title' }), {
            target: { value: 'Sample title' }
        })
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        expect(screen.queryByTestId('spinner')).toBeTruthy()
    })



    it('should redirect to `TodoViewer` after successful submission', async () => {
        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
        fireEvent.change(screen.queryByRole('textbox', { name: 'todo-title' }), {
            target: { value: 'Sample title' }
        })
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        await waitFor(() => {
            expect(history.location.pathname).toEqual('/todoviewer')
        })
        expect(history.action).toEqual('REPLACE')
    });

    it('should display `Alert` when response failed', async () => {
        const defultErrorMessage = 'Something went wrong'
        server.use(
            rest.post(`${ROOT_URL}/todos`, (req, res, ctx) => {
                return res(ctx.status(401), ctx.set({ 'Access-Control-Allow-Origin': '*' }))
            })
        )

        setup()
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' })
        const addButton = screen.queryByText('Add')
        for (let i = 0; i < 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } })
            fireEvent.click(addButton)
        }
        fireEvent.change(screen.queryByRole('textbox', { name: 'todo-title' }), {
            target: { value: 'Sample title' }
        })
        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        await screen.findByText(defultErrorMessage);
    });


    it('should render the spinner', () => {
        setupWithHistoryProps();
        expect(screen.queryByTestId('spinner')).toBeTruthy();
    });

    it('should render the todo items, make changes and push it back to the server', async () => {
        server.use(
            rest.get(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                    ctx.json(sampleFetchResponse)
                )
            })
        )
        server.use(
            rest.put(`${ROOT_URL}/todos/`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' })
                )
            })
        )

        setupWithHistoryProps();
        const todos = await screen.findAllByText(/Item/);
        expect(todos.length).toBe(sampleFetchResponse.todoItems.length);
        expect(screen.queryByDisplayValue(sampleFetchResponse.todoTitle)).toBeTruthy();

        const addButton = screen.queryByText('Add')
        fireEvent.change(screen.queryByRole('textbox', { name: 'todo-new' }),
            { target: { value: 'A new todo item' } });
        fireEvent.click(addButton);

        fireEvent.click(screen.queryByRole('button', { name: 'action-save' }))
        await waitFor(() => {
            expect(history.location.pathname).toEqual('/todoviewer')
        })
        expect(history.action).toEqual('REPLACE')
    });

    it('should render error in `window.alert`', async () => {
        let errorReceived;
        window.alert = (error) => { errorReceived = error }
        server.use(
            rest.get(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                )
            })
        )
        setupWithHistoryProps();
        await waitFor(() => {
            expect(errorReceived).toEqual('Something went wrong');
        })
    });

    it('should delete the fetched todo', async () => {
        server.use(
            rest.get(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                    ctx.json(sampleFetchResponse)
                )
            })
        )
        server.use(
            rest.delete(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                )
            }),
        )
        setupWithHistoryProps();
        await screen.findAllByText(/Item/);
        const deleteButton = screen.queryByRole('button', { name: 'action-delete' });
        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(history.location.pathname).toEqual('/todoviewer')
        })
        expect(history.action).toEqual('PUSH')
    });

    it('should throw an error while trying to delete todo', async () => {
        let errorReceived;
        window.alert = (error) => { errorReceived = error }

        server.use(
            rest.get(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                    ctx.json(sampleFetchResponse)
                )
            })
        )
        server.use(
            rest.delete(`${ROOT_URL}/todos/${sampleFetchResponse.todoId}`, (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.set({ 'Access-Control-Allow-Origin': '*' }),
                )
            }),
        )
        setupWithHistoryProps();
        await screen.findAllByText(/Item/);
        const deleteButton = screen.queryByRole('button', { name: 'action-delete' });
        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(errorReceived).toEqual('Something went wrong');
        })
    });
})


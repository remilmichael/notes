import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import TodoEditor from './TodoEditor';

const sampleTodos = [
    'This is todo task 0',
    'This is todo task 1',
    'This is todo task 2',
    'This is todo task 3',
    'This is todo task 4'
];

describe('Rendering TodoEditor component', () => {
    it('should Input field and button and NO todo list table  ', () => {
        render(<TodoEditor />);
        const containerComponent = screen.queryByTestId('component-container');
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' });
        const tableComponent = screen.queryByRole('table', { name: 'todo-list' });
        const addButton = screen.queryByText('Add');

        expect(containerComponent).not.toBeNull();
        expect(newItemInput).not.toBeNull();
        expect(addButton).not.toBeNull();

        // no todo list since it's empty
        expect(tableComponent).toBeNull();
        
    });
});

describe('Adding todos', () => {
    let newItemInput, addButton;
    beforeEach(() => {
        render(<TodoEditor />);
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' });
        addButton = screen.queryByText('Add');
        fireEvent.change(newItemInput, { target: { value: sampleTodos[0] } });
        fireEvent.click(addButton);
    })

    it('Adding a single todo', () => {
        // Check for a checkbox before the item
        expect(screen.queryByRole('checkbox', { name: 'checkbox' })).toBeTruthy();

        // Check if newly added item exists in the list
        expect(screen.queryByText(sampleTodos[0])).toBeTruthy();

        // Check if edit icon is shown next to the todo item
        expect(screen.queryByTestId('edit-icon-0')).toBeTruthy();

        // Check if trash icon is shown next to the edit icon
        expect(screen.queryByTestId('trash-icon-0')).toBeTruthy();
    });

    it('Adding multiple todos ', () => {
        // Adding todos 1,2,3 along with 0
        for ( let i = 1; i <= 3; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } });
            fireEvent.click(addButton);
        }
        

        // Check if all todos were added
        expect(screen.queryAllByText(/This is todo task/).length).toBe(4);

        // Check if items are displayed in order with respect to its index
        expect(screen.queryByText(sampleTodos[0]).firstChild).toBe(screen.queryByTestId('todo-item-0').firstChild);
        expect(screen.queryByText(sampleTodos[1]).firstChild).toBe(screen.queryByTestId('todo-item-1').firstChild);
        expect(screen.queryByText(sampleTodos[2]).firstChild).toBe(screen.queryByTestId('todo-item-2').firstChild);
        expect(screen.queryByText(sampleTodos[3]).firstChild).toBe(screen.queryByTestId('todo-item-3').firstChild);
    });
});


describe('Editing an existing todo - todo 1', () => {
    let newItemInput, addButton;
    beforeEach(() => {
        render(<TodoEditor />);
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' });
        addButton = screen.queryByText('Add');
        // Adding two todos
        for ( let i = 0; i < 2; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } });
            fireEvent.click(addButton);
        }
        fireEvent.click(screen.getByTestId('edit-icon-1'));
    })
    
    it('should render a textfield replacing the clicked todo', () => {
         // A textfield must show replacing the editing todo item
        expect(screen.queryByRole('textbox', {name: 'edit-todo-tf-1'})).toBeTruthy();

        // No other textfields are rendered in the table
        expect(screen.queryByRole('textbox', {name: 'edit-todo-tf-0'})).toBeFalsy();
    });
    
    it('should render `tick` and `cancel` icon aside of textfield', () => {
        // `Tick` icon is rendered instead of `Edit` icon
        expect(screen.queryByTestId('tick-mark-icon-1')).toBeTruthy();
        expect(screen.queryByTestId('edit-icon-1')).toBeFalsy();

        // `Cancel` icon is rendered instead of `Trash` icon
        expect(screen.queryByTestId('cancel-icon-1')).toBeTruthy();
        expect(screen.queryByTestId('trash-icon-1')).toBeFalsy();
    });

    describe('Updating item', () => {
        const updatedTodo = 'This is an updated todo item';
        const updatingIndex = 1;
        

        beforeEach(() => {
            const editTextfield = screen.queryByRole('textbox', {name: `edit-todo-tf-${updatingIndex}`});
            fireEvent.change(editTextfield, { target: { value: updatedTodo } });
        })
        
        it('should update the existing todo item', () => {
            fireEvent.click(screen.queryByTestId(`tick-mark-icon-${updatingIndex}`));

            expect(screen.queryByText(updatedTodo)).toEqual(screen.queryByTestId(`todo-item-${updatingIndex}`));
        });

        it('should discard the changes made to the todo item', () => {
            fireEvent.click(screen.queryByTestId(`cancel-icon-${updatingIndex}`));
            expect(screen.queryByText(updatedTodo)).toBeFalsy();
            expect(screen.queryByTestId(`todo-item-${updatingIndex}`)).toEqual(screen.getByText(sampleTodos[updatingIndex]));
        });
    });
});

describe('Clicking checkboxes and deleting todos', () => {
    let newItemInput, addButton;
    beforeEach(() => {
        render(<TodoEditor />);
        newItemInput = screen.queryByRole('textbox', { name: 'todo-new' });
        addButton = screen.queryByText('Add');
        for ( let i = 0; i < sampleTodos.length; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } });
            fireEvent.click(addButton);
        }
    })

    it('should render `delete button` when a checkbox is selected', () => {
        const randomCheckbox = screen.getByTestId('checkbox-1');
        fireEvent.click(randomCheckbox);
        // Check if checkbox is selected
        expect(randomCheckbox.checked).toEqual(true);
        expect(screen.queryByRole('button', { name: 'delete-multiple-todos' })).toBeTruthy();
    });

    it('should delete the selected todos from list when clicked`delete button`', () => {
        fireEvent.click(screen.getByTestId('checkbox-1'));
        fireEvent.click(screen.getByTestId('checkbox-2'));
        fireEvent.click(screen.getByTestId('checkbox-4'));

        // deletes todos 1,2,4
        fireEvent.click(screen.queryByRole('button', { name: 'delete-multiple-todos' }));

        expect(screen.queryByText(sampleTodos[1])).toBeFalsy();
        expect(screen.queryByText(sampleTodos[2])).toBeFalsy();
        expect(screen.queryByText(sampleTodos[4])).toBeFalsy();
        
        expect(screen.queryByText(sampleTodos[0])).toBeTruthy();
        expect(screen.queryByText(sampleTodos[3])).toBeTruthy();
    });
});

describe('Deleting a single item', () => {
    beforeEach(() => {
        render(<TodoEditor />);
        const newItemInput = screen.queryByRole('textbox', { name: 'todo-new' });
        const addButton = screen.queryByText('Add');
        for (let i = 0; i < 2; ++i) {
            fireEvent.change(newItemInput, { target: { value: sampleTodos[i] } });
            fireEvent.click(addButton);
        }
    })

    it('should delete first item - index 0', () => {
        const indexToDelete = 0;
        const trashIcon = screen.getByTestId(`trash-icon-${indexToDelete}`);
        fireEvent.click(trashIcon);

        // second todo should now be the first todo.
        expect(screen.getByTestId(`todo-item-${indexToDelete}`)).toEqual(screen.getByText(sampleTodos[indexToDelete + 1]));
    });
});
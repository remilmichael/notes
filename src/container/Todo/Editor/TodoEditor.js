import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as CheckMarkIcon } from '../../../assets/checkmark.svg';
import { ReactComponent as ReturnIcon } from '../../../assets/returnicon.svg';
import { ReactComponent as TrashIcon } from '../../../assets/trashicon.svg';
import { ReactComponent as EditIcon } from '../../../assets/editicon.svg';

import { useApiCallReducer } from './reducer/reducer';

import axios from '../.../../../../axios-notes';
import InputComponent from '../Input/Input';
import Actions from '../../NoteEditor/Action/Action';
import TodoList from '../Table/Table';
import * as actions from './reducer/actions';
import TextField from '../../../component/UI/TextField/TextField';
import classes from './TodoEditor.module.css';

function TodoEditor() {

    /**
    *    initialState = {
    *        todos: [], // contains { item: string, strike: boolean, index: number}
    *    }
    */
    const [state, dispatch] = useApiCallReducer();
    const [selectedCbSet, setSelectedCbSet] = useState(new Set());
    const [editItemIndex, setEditItemIndex] = useState(-1);

    const reduxState = useSelector(rstate => rstate.auth);

    const inputRef = React.useRef(null);
    const editInputRef = React.useRef(null);
    const titleInputRef = React.useRef(null);

    useEffect(() => {
        document.title = 'ToDo Editor';
    }, [])
    
    /**
     * Function to add a new item in to the todo list
     * Uses `useRef` hook to achieve this.
     * 
     * @function addItem
     */
    const addItem = () => {
        if (inputRef.current && inputRef.current.value) {
            const item = inputRef.current.value;
            if (item.trim().length === 0) {
                // Raise error
            } else {
                const nextIndex = state.todos.length;
                const newTodo = {
                    item: item.trim(),
                    strike: false,
                    index: nextIndex
                }
                dispatch({
                    type: actions.APPEND_ITEM,
                    payload: newTodo
                });
                inputRef.current.value = '';
            }
            inputRef.current.focus();
        }
        
    }

    /**
     * Check whether the key pressed was 'Enter' key,
     *      if yes adds the item to the todo list
     * 
     * @function checkKeyEvent
     * @param {Event} event - Key event
     */
    const checkKeyEvent = (event) => {
        if(event.key === 'Enter') {
            addItem();
        }
    }

    /**
     * Function to handle checkbox state changes, if a
     *      checkbox is checked/selected, corresponding index
     *      is inserted into a `Set`(selectedCbSet) variable and removed
     *      when un-checked/un-selected.
     * To perform actions later on multiple todo items (e.g. delete)
     * 
     * @function handleCheckBoxEvent
     * @param {Event} event - Event on checkbox
     */
    const handleCheckBoxEvent = (event) => {
        const isChecked = event.target.checked;
        const checkBoxName = event.target.name;
        const newSet = new Set(selectedCbSet);

        if (isChecked) {

            newSet.add(checkBoxName);
            setSelectedCbSet(newSet)

        } else {
            // if it was already selected, and now has de-selected
            newSet.delete(checkBoxName);
            setSelectedCbSet(newSet);
        }
    }

    /**
     * Function to delete multiple todo items whose index in
     *      the `selectedCbSet` state
     */
    const multipleDeleteHandler = () => {
        dispatch({
            type: actions.DELETE_MULTIPLE_ITEMS,
            payload: selectedCbSet
        });
        if (selectedCbSet.has(editItemIndex.toString())) {
            setEditItemIndex(-1);
        }
        setSelectedCbSet(new Set());
    }

    /**
     * Function to delete the item when clicked on Trash icon
     *      against the label
     * 
     * @function singleItemDeleteHandler
     * @param {Number} index 
     */
    const singleItemDeleteHandler = (index) => {
        dispatch({type: actions.DELETE_ITEM, payload: index});
        setSelectedCbSet(new Set());
    }

    /**
     * Function to replace the todo item with a textfield
     *      to edit an already existing item.
     * 
     * @function itemEditHandler
     * @param {Number} index 
     */
    const itemEditHandler = (index) => {
        setEditItemIndex(index);
    }

    /**
     * Function to save changes made to an existing todo item
     * Calls setEditItemIndex(index)
     * 
     * @function saveChangesHandler
     */
    const saveChangesHandler = () => {
        if (editInputRef.current) {
            if (editInputRef.current.value.trim().length !== 0) {
                const payload = {
                    index: editItemIndex,
                    value: editInputRef.current.value
                };
                dispatch({type: actions.SAVE_CHANGES, payload: payload});
                setEditItemIndex(-1);
            } else {
                // raise error
            }
        } else {
            // something went wrong
        }
    }

    /**
     * Function discard changes made to an existing todo item
     * Calls setEditItemIndex(-1);
     * 
     * @function clearEditablesHandler
     */
    const clearEditablesHandler = () => {
        setEditItemIndex(-1);
    }

    const saveToDatabase = () => {

        const title = titleInputRef.current.value;

        if (state.todos.length === 0) {
            // raise error
        } else if (title.trim().length === 0) {
            // raise error
        } else {
            const todoItem = {
                title: title,
                todo: state.todos,
            }
            
            axios.post();
        }
    }

    let deleteButton = null;
    if (selectedCbSet.size !== 0) {
        deleteButton = <button 
                            aria-label="delete-multiple-todos"
                            type="button" 
                            className="btn btn-danger"
                            onClick={multipleDeleteHandler}>Delete selected</button>
    }

    
    let tableBody;
    if (state.todos.length !== 0) {
        tableBody = state.todos.map(item => {
            const content = item.strike === true 
                ? 
                <del data-testid={`striked-todo-${item.index}`}>{item.item}</del>
                :
                item.item;

            return (
                <tr key={item.index} data-test="todoitem">
                    <td>
                        <input 
                            data-testid={`checkbox-${item.index}`}
                            aria-label="checkbox"
                            type="checkbox" 
                            name={item.index} 
                            onChange={(e) => handleCheckBoxEvent(e)} 
                            checked={selectedCbSet.has(item.index.toString())}
                        />
                    </td>
                    <td className={classes.TdContent}>
                        {
                            item.index === editItemIndex
                            ?
                            <TextField
                                arialabel={`edit-todo-tf-${item.index}`}
                                content={content}
                                name={item.index}
                                inputRef={editInputRef} />
                            :
                            <span 
                                data-testid={`todo-item-${item.index}`}
                                className={classes.Item}
                                onClick={() => dispatch({type: actions.CHANGE_STRIKE_STATE, payload: item.index})}>
                                {content}
                            </span>
                        }
                    </td>
                    <td>
                        {
                            item.index === editItemIndex ? 
                                        <CheckMarkIcon 
                                            data-testid={`tick-mark-icon-${item.index}`}
                                            className={classes.CheckMarkIcon} 
                                            onClick={saveChangesHandler}
                                        /> 
                                        :
                                        <EditIcon 
                                            data-testid={`edit-icon-${item.index}`}
                                            className={classes.EditIcon}
                                            onClick={() => itemEditHandler(item.index)}
                                        />
                        }    
                    </td>
                    <td>
                        {
                            item.index === editItemIndex ? 
                                        <ReturnIcon 
                                            data-testid={`cancel-icon-${item.index}`}
                                            className={classes.ReturnIcon}
                                            onClick={clearEditablesHandler}
                                        /> 
                                        : 
                                        <TrashIcon 
                                            data-testid={`trash-icon-${item.index}`}
                                            className={classes.TrashIcon}
                                            onClick={() => singleItemDeleteHandler(item.index)}
                                        />
                        }
                    </td>
                </tr>
            );
        })
    }
    return (
        <Container fluid data-testid="component-container">
            <Row className="mt-4">
                <Col className="col-md-3 offset-md-3 pl-md-5">
                    <input 
                        type="text" 
                        ref={titleInputRef}
                        aria-label="todo-title"
                        name="todo-title"
                        className={`${classes.input} ${classes.question}`}
                        id="title"
                        required
                        autoComplete="off" />
                    <label 
                        htmlFor="title">
                        <span>Todo title</span>
                    </label>
                </Col>
                <Col className="col-12 offset-0 col-md-3 mt-5 mt-lg-0 offset-md-3">
                    <Actions 
                        clickedSave={saveToDatabase}
                    />
                </Col>
            </Row>
            <InputComponent 
                inputRef={inputRef}
                addItem={addItem} 
                keyPressed={checkKeyEvent} 
                clicked={addItem}
            />
            <Row className="mt-3 mt-lg-5">
                <Col className="col-12 col-lg-5 offset-6 pl-4 offset-lg-6">
                    {deleteButton}
                </Col>
            </Row>
            <TodoList body={tableBody} />
        </Container>
    );
}

export default TodoEditor;
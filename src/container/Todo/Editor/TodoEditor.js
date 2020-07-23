import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import InputComponent from '../Input/Input';
import * as actions from './actions';
import { useApiCallReducer } from './reducer';
import Table from '../Table/Table';
import { ReactComponent as TrashIcon} from '../../../assets/trashicon.svg'
import classes from './TodoEditor.module.css';

function TodoEditor() {

    console.log('TodoEditor');

    // state contains => todos: Array, nextIndex: number
    const [state, dispatch] = useApiCallReducer();
    const [selectedCbSet, setSelectedCbSet] = useState(new Set());

    const inputRef = useRef(null);

    useEffect(() => {
        document.title = 'ToDo';
    }, [])
    
    const addItem = () => {

        const item = inputRef.current.value;

        if (item.trim().length === 0) {
            // Raise error
        } else {
            const nextIndex = state.nextIndex;
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

    const checkKeyEvent = (event) => {
        if(event.key === 'Enter') {
            addItem();
        }
    }

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

    const multipleDeleteHandler = () => {

        dispatch({
            type: actions.DELETE_MULTIPLE_ITEMS,
            payload: selectedCbSet
        });

        setSelectedCbSet(new Set());
    }

    // Handler which deletes the item when clicked on Trash icon.
    const singleItemDeleteHandler = (index) => {
        dispatch({type: actions.DELETE_ITEM, payload: index});
        setSelectedCbSet(new Set());
    }

    let deleteButton = null;
    if (selectedCbSet.size !== 0) {
        deleteButton = <button type="button" 
                            className="btn btn-danger"
                            onClick={multipleDeleteHandler}>Delete selected</button>
    }

    let tableBody;
    if (state.todos.length !== 0) {
        tableBody = state.todos.map(item => {
            const content = item.strike === true ? <del>{item.item}</del> : item.item;
            return (
                <tr key={item.index}>
                    <td>
                        <input 
                            type="checkbox" 
                            name={item.index} 
                            onChange={(e) => handleCheckBoxEvent(e)} 
                            checked={selectedCbSet.has(item.index.toString())}
                            />
                    </td>
                    <td className="w-75">
                        <span 
                            className={classes.Item}
                            onClick={() => dispatch({type: actions.CHANGE_STRIKE_STATE, payload: item.index})}>
                            {content}
                        </span>
                    </td>
                    <td>
                        <TrashIcon 
                            className={classes.TrashIcon}
                            onClick={() => singleItemDeleteHandler(item.index)}  />
                    </td>
                </tr>
            );
        })
    }

    return (
        <Container fluid>
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
            <Table body={tableBody} />
        </Container>
    );
}

export default TodoEditor;
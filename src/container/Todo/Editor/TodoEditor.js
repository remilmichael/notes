import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import InputComponent from '../Input/Input';
import * as actions from './actions';
import { useApiCallReducer } from './reducer';
import Table from '../Table/Table';
import { ReactComponent as TrashIcon} from '../../../assets/trashicon.svg'
import classes from './TodoEditor.module.css';

function TodoEditor() {

    console.log('TodoEditor');

    const [state, dispatch] = useApiCallReducer();

    const inputRef = useRef(null);
    const addItem = () => {

        const item = inputRef.current.value;

        if (item.trim().length === 0) {
            inputRef.current.focus();
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
            inputRef.current.focus();
        }
    }

    const checkKeyEvent = (event) => {
        if(event.key === 'Enter') {
            addItem();
        }
    }

    let tableBody;
    if (state.todos.length !== 0) {
        tableBody = state.todos.map(item => {
            const content = item.strike === true ? <del>{item.item}</del> : item.item;
            return (
                <tr key={item.index}>
                    <td><input type="checkbox" name={item.index} /></td>
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
                            onClick={() => dispatch({type: actions.DELETE_ITEM, payload: item.index})}  />
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
            <Table body={tableBody} />
        </Container>
    );
}

export default TodoEditor;
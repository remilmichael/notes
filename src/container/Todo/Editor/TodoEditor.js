import React, { useState, useReducer, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import InputComponent from '../Input/Input';
import * as actions from './actions';
import reducer from './reducer';

const initialState = {
    todos: [],
    nextIndex: 0
}

function TodoEditor() {

    console.log("Todo Editor")

    const [item, setItem] = useState('');
    const [state, dispatch] = useReducer(reducer, initialState);

    console.log(state);

    const addItem = () => {
        if (item.trim().length === 0) {
            // Raise error
        } else {
            const nextIndex = state.nextIndex;
            const newItem = {
                item: item,
                index: nextIndex
            }
            console.log("add item")
            dispatch({
                type: actions.APPEND_ITEM,
                payload: newItem
            });
            setItem('');
        }
    }

    const checkKeyEvent = (event) => {
        if(event.key === 'Enter') {
            addItem();
        }
    }


    return (
        <Container fluid>
            <InputComponent 
                changeItem={(e) => setItem(e.target.value)} 
                addItem={addItem} 
                keyPressed={checkKeyEvent} 
                clicked={addItem}
            />
        </Container>
    );
}

export default TodoEditor;
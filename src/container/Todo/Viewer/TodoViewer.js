import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useApiCallReducer } from '../Editor/reducer/reducer';

function TodoViewer() {

    // const authReducer = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    console.log(dispatch);

    return (
        <div>

        </div>
    )
}

export default TodoViewer

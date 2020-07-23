import React from 'react';

function TextField(props) {
    return (
        <input type="text"
            className="form-control" 
            name={props.name}
            ref={props.inputRef}
            defaultValue={props.content}
             />
    );
}

export default TextField;
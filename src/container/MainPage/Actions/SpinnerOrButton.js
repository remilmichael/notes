import React from 'react';
import { Button } from 'react-bootstrap';

const spinner = (props) => {
    let spinner = null;
    if (props.disabled === true) {
        spinner = <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />;
    }
    return (
        <Button variant="primary" size="md" disabled={props.disabled} onClick={props.clickedMoreNotes}>
            {spinner}{props.message}
        </Button>
    )
};

export default spinner;
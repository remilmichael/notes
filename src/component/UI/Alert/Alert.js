import React from 'react';
import { Alert } from 'react-bootstrap';

const alert = (props) => {
    return (
        <Alert variant={props.type}>
            <strong>{props.message}</strong>
        </Alert>
    );
};

export default alert;


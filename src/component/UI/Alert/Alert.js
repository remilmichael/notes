import React from 'react';
import { Alert } from 'react-bootstrap';

import PropTypes from 'prop-types'

const alert = (props) => {
    return (
        <Alert variant={props.type}>
            <strong>{props.message}</strong>
        </Alert>
    );
};

export default alert;

alert.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};
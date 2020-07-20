import React from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './Input.module.css';

function Input(props) {
    return (
        <Row className="mt-5">
            <Col className="col-12 col-md-3 offset-md-3 pl-5">
                <input type="text" className="form-control" placeholder="Add new" onChange={props.changeItem} onKeyDown={props.keyPressed} />
            </Col>
            <Col className="col-6">
                <button type="button" className={`${classes.AddButton} btn`} onClick={props.clicked}>Add</button>
            </Col>
        </Row>
    );
}

export default Input;
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './Input.module.css';

function Input(props) {

    return (
        <Row className="mt-5">
            <Col className="col-12 col-md-3 offset-md-3 pl-md-5">
                <input type="text"
                    required
                    ref={props.inputRef}
                    className="form-control"
                    placeholder="Add new"
                    onKeyDown={props.keyPressed} />
            </Col>
            <Col className="col-6 pt-3 pt-md-0">
                <button 
                    type="button" 
                    className={`${classes.AddButton} btn`} 
                    onClick={props.clicked}>Add</button>
            </Col>
        </Row>
    );
}

export default Input;
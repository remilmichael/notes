import React from 'react';
import { Col, Row } from 'react-bootstrap';

import classes from './Action.module.css'
const noteActions = (props) => {
    return (
        <>
            <Row className="mb-3 mb-md-0 text-center">
                <Col className="col-4 pl-0" data-test="component-button">
                    <button 
                        type="button" 
                        className={`${classes.SaveBtn} btn btn-lg`}
                        id="saveBtn"
                        onClick={props.clickedSave}>Save</button>
                </Col>
                <Col className="col-4 pl-0" data-test="component-button">
                    <button 
                    type="button"
                    id="deleteBtn"
                    disabled={props.delDisabled}
                    onClick={props.clickedDelete}
                    className={`${classes.DeleteBtn} btn btn-lg`}>Delete</button>
                </Col>
                <Col className="col-4 pl-0" data-test="component-button">
                    <button 
                    type="button"
                    id="cancelBtn"
                    onClick={props.clickedCancel}
                    className={`${classes.CancelBtn} btn btn-lg`}>Cancel</button>
                </Col>
            </Row>
        </>
    );
};

export default noteActions;
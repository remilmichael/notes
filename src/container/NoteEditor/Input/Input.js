import React from 'react';
import { InputGroup, Row, Col } from 'react-bootstrap';
import classes from './Input.module.css';

const noteInput = (props) => {
    return (
        <React.Fragment>
            <Row className="mb-4">
                <Col>
                    <InputGroup>
                        <input 
                            type="text"
                            className={classes.Textfield + ' form-control'}
                            id="noteheading"
                            onChange={props.formChanged}
                            spellCheck="false"  
                            placeholder="Note heading"
                            aria-label="NoteHeading" 
                            value={props.heading}
                            />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <textarea 
                            className={classes.Textarea + ' form-control shadow-lg p-3 mb-5 rounded'}
                            id="notearea"
                            onChange={props.formChanged}
                            spellCheck="false" 
                            aria-label="notes" 
                            placeholder="Note"
                            value={props.body}
                            />
                    </InputGroup>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default noteInput;
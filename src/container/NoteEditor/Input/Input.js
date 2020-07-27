import React from 'react';
import { InputGroup, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import classes from './Input.module.css';

const NoteInput = (props) => {
    return (
        <React.Fragment>
            <Row className="mb-4">
                <Col>
                    <InputGroup>
                        <input 
                            data-test="component-input-heading"
                            type="text"
                            className={`${classes.Textfield} form-control`}
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
                            data-test="component-input-notes"
                            className={`${classes.Textarea} form-control shadow-lg p-3 mb-5 rounded`}
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

export default NoteInput;

NoteInput.propTypes = {
    heading: PropTypes.string,
    body: PropTypes.string.isRequired
}
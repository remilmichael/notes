import React from 'react';
import { Col, Row, InputGroup, Button } from 'react-bootstrap';

const authComponents = (props) => {
    return (
        <>
            <Row>
                <Col className="col-12">
                    <InputGroup>
                        <input
                            type="text"
                            className="form-control ml-1"
                            id="username"
                            spellCheck="false"
                            placeholder="Username"
                            onChange={props.userNameChanged}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col className="col-12 mt-4">
                    <InputGroup>
                        <input
                            type="password"
                            className="form-control ml-1"
                            id="password"
                            spellCheck="false"
                            placeholder="Password"
                            onChange={props.passwordChanged}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row className="mt-4 text-center">
                <Col>
                    <button 
                        type="button"
                        id="loginBtn"
                        className="btn btn-primary"
                        onClick={props.loginClicked}
                    >Login</button>
                </Col>
                <Col>
                    <Button variant="secondary" onClick={props.cancelClicked} id="cancelBtn">
                        Cancel
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default authComponents;
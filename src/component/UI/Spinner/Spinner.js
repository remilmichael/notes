import React from 'react';
import { Row, Col } from 'react-bootstrap';

import './Spinner.css';

const spinner = () => (
    <Row className="text-center" style={{height: '100vh'}}>
        <Col className="pl-0 col-sm-4 offset-sm-4 align-self-center">
            <div className="lds-hourglass"></div>
        </Col>
    </Row>
);

export default spinner;
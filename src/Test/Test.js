import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Test.css';

const test = () => {
    const unix_time = new Date().getTime();
    console.log(unix_time);
    const time = new Date(-1589265190749).toUTCString();
    fetch();
    return (
        <Container>
            <Row>
                <Col className="border border-primary">
                    <p>{time}</p>
                </Col>
            </Row>
        </Container>
    );
}


export default test;
import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import classes from './Table.module.css';

function table(props) {
    return (
        <Row className="mt-3">
            <Col className="col-12 col-lg-5 offset-lg-3">
                <Table striped hover className={classes.table}>
                    <tbody>
                        {props.body}
                    </tbody>
                </Table>
            </Col>
        </Row>        
    );
}

export default table;
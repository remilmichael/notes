import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import classes from './Table.module.css';

function table(props) {

    if (!props.body) {
        return null;
    }

    return (
        <Row>
            <Col className="col-12 col-lg-5 offset-lg-3">
                <Table hover className={classes.Table} role="table" aria-label="todo-list">
                    <tbody>
                        {props.body}
                    </tbody>
                </Table>
            </Col>
        </Row>        
    );
}

export default table;
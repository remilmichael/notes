import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Col, Card, Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import * as actions from '../../../store/actions/';
import classes from './TodoViewer.module.css';

function TodoViewer() {

    const auth = useSelector((state) => state.auth);
    const todolist = useSelector(state => state.todolist);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!auth.idToken) {
            history.push('/login');
            dispatch(actions.clearTitles());
        }
    }, [auth.idToken, history, dispatch]);

    useEffect(() => {
        if (todolist.todos.length === 0 && !todolist.fetchFailed && auth.idToken) {
            dispatch(actions.fetchAllTodos());
        }
    }, [todolist, dispatch, auth.idToken]);

    const todoList = todolist.todos.map((item) => {
        return (<Col className="col-12 col-md-4 mt-3" key={item.todoId}>
            <Card bg="light" text="dark" data-testid="component-note-item">
                <NavLink to={`/todos?id=${item.todoId}`} className={classes.link}>
                    <Card.Body>
                        <Card.Text>
                            {item.todoTitle}
                        </Card.Text>
                    </Card.Body>
                </NavLink>
            </Card>
        </Col>);
    });

    return (
        <Container>
            <Row>{todoList}</Row>
        </Container>
    )
}

export default TodoViewer;

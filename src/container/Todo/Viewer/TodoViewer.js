import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Col, Card, Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import * as actions from '../../../store/actions/';
import classes from './TodoViewer.module.css';
import SpinnerAndButton from '../../../component/UI/SpinnerAndButton/SpinnerAndButton';

function TodoViewer() {

    const auth = useSelector((state) => state.auth);
    const todolist = useSelector(state => state.todolist);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!auth.userId) {
            dispatch(actions.clearTitles());
            history.push('/login?redirect=todoviewer');
        }
    }, [auth.userId, history, dispatch]);

    useEffect(() => {
        if (todolist.todos.length === 0 &&
            !todolist.fetchFailed &&
            auth.userId &&
            !todolist.loading &&
            todolist.hasMoreTodos) {
            dispatch(actions.fetchAllTodos(todolist.nextRecordNumber, auth.secretKey));
        }
    }, [todolist, dispatch, auth.userId, auth.secretKey]);


    /**
     * Function to fetch more todos from server
     *      of length ${RECORD_COUNT}
     * @function loadMoreTodos
     */
    const loadMoreTodos = () => {
        dispatch(actions.fetchAllTodos(todolist.nextRecordNumber));
    }

    let todoList = todolist.todos.map((item, index) => {
        return (<Col className="col-12 col-md-4 mt-3" key={item.todoId}>
            <Card bg="light" text="dark" data-testid={`todo-title-${index}`}>
                <NavLink to={`/todo?id=${item.todoId}`} className={classes.link}>
                    <Card.Body>
                        <Card.Text>
                            {item.todoTitle}
                        </Card.Text>
                    </Card.Body>
                </NavLink>
            </Card>
        </Col>);
    });

    let moreButton;
    if (todolist.hasMoreTodos && auth.userId) {
        if (todolist.fetchFailed) {
            moreButton = (
                <SpinnerAndButton
                    disabled={true}
                    variant="secondary"
                    message="Failed to connect"
                    clickedMore={loadMoreTodos}
                />
            );
        } else if (!todolist.loading) {
            moreButton = (
                <SpinnerAndButton
                    disabled={false}
                    variant="primary"
                    message="Load more"
                    clickedMore={loadMoreTodos}
                />
            );
        } else {
            moreButton = (
                <SpinnerAndButton
                    disabled={true}
                    variant="primary"
                    message=" Loading..."
                />
            );
        }
    }

    const addNewButton = (
        <>
            <Row className="mt-3">
                <Col>
                    <NavLink to="/todo">
                        <button
                            data-test="component-addbutton"
                            type="button"
                            className="btn btn-dark"
                        >
                            New Todo
                </button>
                    </NavLink>
                </Col>
            </Row>
        </>
    );

    return (
        <Container>
            {addNewButton}
            <Row>{todoList}</Row>
            <Row className="mt-5 justify-content-center">
                <Col></Col>
                <Col>{moreButton}</Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default TodoViewer;

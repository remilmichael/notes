import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Redirect, useHistory } from "react-router";
import axios from "axios";

import { ReactComponent as CheckMarkIcon } from "../../../assets/checkmark.svg";
import { ReactComponent as ReturnIcon } from "../../../assets/returnicon.svg";
import { ReactComponent as TrashIcon } from "../../../assets/trashicon.svg";
import { ReactComponent as EditIcon } from "../../../assets/editicon.svg";

import { useApiCallReducer } from "./reducer/reducer";

import Axios from "../.../../../../axios-notes";
import InputComponent from "../Input/Input";
import Actions from "../../NoteEditor/Action/Action";
import TodoList from "../Table/Table";
import * as actions from "./reducer/actions";
import TextField from "../../../component/UI/TextField/TextField";
import classes from "./TodoEditor.module.css";
import Spinner from "../../../component/UI/Spinner/Spinner";
import Alert from "../../../component/UI/Alert/Alert";
import * as reduxActionTypes from '../../../store/actions/actionTypes';
import { generateHeader } from '../../../utility';

function TodoEditor() {
  /**
   *    initialState = {
   *        todos: [], // contains { item: string, strike: boolean, index: number}
   *        loading: boolean
   *        saveSuccessful: boolean
   *    }
   */

  const [state, dispatch] = useApiCallReducer();
  const [selectedCbSet, setSelectedCbSet] = useState(new Set());
  const [editItemIndex, setEditItemIndex] = useState(-1);

  const authReduxReducer = useSelector((rstate) => rstate.auth);
  const dispatchRedux = useDispatch();

  const inputRef = React.useRef(null);
  const editInputRef = React.useRef(null);
  const titleInputRef = React.useRef(null);

  const source = axios.CancelToken.source();
  const history = useHistory();
  const urlParams = new URLSearchParams(history.location.search);
  const urlParamsId = urlParams.get('id');

  useEffect(() => {
    if (urlParamsId && authReduxReducer.idToken) {
      const header = generateHeader(authReduxReducer.idToken);
      dispatch({ type: actions.INIT_SPINNER });
      Axios.get(`/todos/${urlParamsId}`, {
        headers: header
      }).then((response) => {
        if (response.data) {
          const todoId = response.data.todoId;
          const todoTitle = response.data.todoTitle;
          const todoItems = response.data.todoItems;
          if (!todoId || !todoTitle || !todoItems) {
            dispatch({ type: actions.STOP_SPINNER });
            alert('Something went wrong');
            history.push('/todoviewer');
          } else {
            const todos = [];
            todoItems.forEach((item) => {
              todos.push({
                item: item.todoItem,
                index: item.todoIndex,
                strike: item.strike
              });
            });
            const fetchedTodo = {
              todos: todos,
              todoId: todoId,
              todoTitle: todoTitle
            }
            dispatch({ type: actions.FETCH_FROM_DB_SUCCESS, payload: fetchedTodo });
          }
        }
      }).catch((error) => {
        dispatch({ type: actions.STOP_SPINNER });
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('Something went wrong');
        }
        history.push('/todoviewer');
      })
    }
  }, [urlParamsId, authReduxReducer.idToken, dispatch, history]);

  useEffect(() => {
    document.title = "ToDo Editor";
    let errorTimeout;
    if (state.error) {
      errorTimeout = setTimeout(() => {
        dispatch({ type: actions.UNSET_ERROR });
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimeout);
      source.cancel();
    };
  }, [state.error, dispatch, source]);

  /**
   * Function to add a new item in to the todo list
   * Uses `useRef` hook to achieve this.
   *
   * @function addItem
   */
  const addItem = () => {
    if (inputRef.current && inputRef.current.value) {
      const item = inputRef.current.value;
      if (item.trim().length === 0) {
        alert('Nothing to add');
      } else {
        const nextIndex = state.todos.length;
        const newTodo = {
          item: item,
          strike: false,
          index: nextIndex,
        };
        dispatch({
          type: actions.APPEND_ITEM,
          payload: newTodo,
        });
        inputRef.current.value = "";
      }
      inputRef.current.focus();
    }
  };

  /**
   * Check whether the key pressed was 'Enter' key,
   *      if yes adds the item to the todo list
   *
   * @function checkKeyEvent
   * @param {Event} event - Key event
   */
  const checkKeyEvent = (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  /**
   * Function to handle checkbox state changes, if a
   *      checkbox is checked/selected, corresponding index
   *      is inserted into a `Set`(selectedCbSet) variable and removed
   *      when un-checked/un-selected.
   * To perform actions later on multiple todo items (e.g. delete)
   *
   * @function handleCheckBoxEvent
   * @param {Event} event - Event on checkbox
   */
  const handleCheckBoxEvent = (event) => {
    const isChecked = event.target.checked;
    const checkBoxName = event.target.name;
    const newSet = new Set(selectedCbSet);

    if (isChecked) {
      newSet.add(checkBoxName);
      setSelectedCbSet(newSet);
    } else {
      // if it was already selected, and now has de-selected
      newSet.delete(checkBoxName);
      setSelectedCbSet(newSet);
    }
  };

  /**
   * Function to delete multiple todo items whose index in
   *      the `selectedCbSet` state
   */
  const multipleDeleteHandler = () => {
    dispatch({
      type: actions.DELETE_MULTIPLE_ITEMS,
      payload: selectedCbSet,
    });
    if (selectedCbSet.has(editItemIndex.toString())) {
      setEditItemIndex(-1);
    }
    setSelectedCbSet(new Set());
  };

  /**
   * Function to delete the item when clicked on Trash icon
   *      against the label
   *
   * @function singleItemDeleteHandler
   * @param {Number} index
   */
  const singleItemDeleteHandler = (index) => {
    dispatch({ type: actions.DELETE_ITEM, payload: index });
    setSelectedCbSet(new Set());
  };

  /**
   * Function to replace the todo item with a textfield
   *      to edit an already existing item.
   *
   * @function itemEditHandler
   * @param {Number} index
   */
  const itemEditHandler = (index) => {
    setEditItemIndex(index);
  };

  /**
   * Function to save changes made to an existing todo item
   * Calls setEditItemIndex(index)
   *
   * @function saveChangesHandler
   */
  const saveChangesHandler = () => {
    if (editInputRef.current) {
      if (editInputRef.current.value.trim().length !== 0) {
        const payload = {
          index: editItemIndex,
          value: editInputRef.current.value,
        };
        dispatch({ type: actions.SAVE_CHANGES, payload: payload });
        setEditItemIndex(-1);
      } else {
        // raise error
      }
    } else {
      // something went wrong
    }
  };

  /**
   * Function discard changes made to an existing todo item
   * Calls setEditItemIndex(-1);
   *
   * @function clearEditablesHandler
   */
  const clearEditablesHandler = () => {
    setEditItemIndex(-1);
  };


  /**
   * Function to push the todo to the database
   *
   * @function saveToDatabase
   */
  const saveToDatabase = async () => {
    const title = titleInputRef.current.value;
    if (state.todos.length === 0) {
      dispatch({
        type: actions.SET_ERROR,
        payload: {
          error: "Nothing to save",
          errorType: "warning",
        },
      });
    } else if (title.trim().length === 0) {
      dispatch({
        type: actions.SET_ERROR,
        payload: {
          error: "Give a title for todo",
          errorType: "warning",
        },
      });
    } else {
      const headers = generateHeader(authReduxReducer.idToken);
      const todoItems = [];
      state.todos.forEach((item) => {
        todoItems.push({
          todoIndex: item.index,
          todoItem: item.item,
          strike: item.strike,
        });
      });
      const newTodo = {
        todoId: state.fetchTodoId ? state.fetchTodoId : uuidv4(),
        todoTitle: title,
        username: authReduxReducer.userId,
        lastUpdated: new Date().getTime(),
        todoItems: todoItems,
      };
      dispatch({ type: actions.SAVE_TO_DB_START });

      try {
        let response;
        if (state.fetchTodoId) {
          response = await Axios.put("/todos", newTodo, { headers: headers });
        } else {
          response = await Axios.post("/todos", newTodo, { headers: headers });
        }
        if (response) {
          dispatch({ type: actions.SAVE_TO_DB_SUCCESS });
          if (state.fetchTodoId) {
            dispatchRedux({ type: reduxActionTypes.UPDATE_TODO_REDUX, payload: newTodo });
          } else {
            dispatchRedux({ type: reduxActionTypes.SAVE_TODO_REDUX, payload: newTodo });
          }
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          dispatch({ type: actions.SAVE_TO_DB_FAILED });
          if (error && error.response && error.response.message) {
            dispatch({
              type: actions.SET_ERROR,
              payload: {
                error: error.data.message,
                errorType: "error",
              },
            });
          } else {
            dispatch({
              type: actions.SET_ERROR,
              payload: {
                error: "Something went wrong",
                errorType: "error",
              },
            });
          }
        }
      }
    }
  }

  /**
   * Function to delete the todo from redux and database
   * 
   * @function deleteThisTodo
   */
  const deleteThisTodo = async () => {
    const header = generateHeader(authReduxReducer.idToken);
    dispatch({ type: actions.INIT_SPINNER })
    try {
      const response = await Axios.delete(`/todos/${state.fetchTodoId}`,
        { headers: header });
      if (response) {
        dispatchRedux({ type: reduxActionTypes.DELETE_TODO_REDUX, payload: state.fetchTodoId });
        dispatch({ type: actions.STOP_SPINNER })
        history.push('/todoviewer')
      }
    } catch (error) {
      alert('Something went wrong');
      dispatch({ type: actions.STOP_SPINNER })
    }
  }

  let deleteButton = null;
  if (selectedCbSet.size !== 0) {
    deleteButton = (
      <button
        aria-label="delete-multiple-todos"
        type="button"
        className="btn btn-danger"
        onClick={multipleDeleteHandler}
      >
        Delete selected
      </button>
    );
  }

  let tableBody;
  if (state.todos.length !== 0) {
    tableBody = state.todos.map((item) => {
      const content =
        item.strike === true ? (
          <del data-testid={`striked-todo-${item.index}`}>{item.item}</del>
        ) : (
            item.item
          );

      return (
        <tr key={item.index} data-test="todoitem">
          <td>
            <input
              data-testid={`checkbox-${item.index}`}
              aria-label="checkbox"
              type="checkbox"
              name={item.index}
              onChange={(e) => handleCheckBoxEvent(e)}
              checked={selectedCbSet.has(item.index.toString())}
            />
          </td>
          <td className={classes.TdContent}>
            {item.index === editItemIndex ? (
              <TextField
                arialabel={`edit-todo-tf-${item.index}`}
                content={content}
                name={item.index}
                inputRef={editInputRef}
              />
            ) : (
                <span
                  data-testid={`todo-item-${item.index}`}
                  className={classes.Item}
                  onClick={() =>
                    dispatch({
                      type: actions.CHANGE_STRIKE_STATE,
                      payload: item.index,
                    })
                  }
                >
                  {content}
                </span>
              )}
          </td>
          <td>
            {item.index === editItemIndex ? (
              <CheckMarkIcon
                data-testid={`tick-mark-icon-${item.index}`}
                className={classes.CheckMarkIcon}
                onClick={saveChangesHandler}
              />
            ) : (
                <EditIcon
                  data-testid={`edit-icon-${item.index}`}
                  className={classes.EditIcon}
                  onClick={() => itemEditHandler(item.index)}
                />
              )}
          </td>
          <td>
            {item.index === editItemIndex ? (
              <ReturnIcon
                data-testid={`cancel-icon-${item.index}`}
                className={classes.ReturnIcon}
                onClick={clearEditablesHandler}
              />
            ) : (
                <TrashIcon
                  data-testid={`trash-icon-${item.index}`}
                  className={classes.TrashIcon}
                  onClick={() => singleItemDeleteHandler(item.index)}
                />
              )}
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      {authReduxReducer.idToken === null ? (
        <Redirect to="/login?redirect=todo" />
      ) : null}
      {state.saveSuccessful ? <Redirect to="/todoviewer" /> : null}
      {state.loading ? (
        <Spinner />
      ) : (
          <Container fluid data-testid="component-container">
            <Row className="mt-4">
              <Col className="col-md-3 offset-md-3 pl-md-5">
                <input
                  type="text"
                  ref={titleInputRef}
                  aria-label="todo-title"
                  name="todo-title"
                  className={`${classes.input} ${classes.question}`}
                  id="title"
                  required
                  autoComplete="off"
                  defaultValue={state.fetchTodoTitle}
                />
                <label htmlFor="title">
                  <span>Todo title</span>
                </label>
              </Col>
              <Col className="col-12 offset-0 col-md-3 mt-5 mt-lg-0 offset-md-3">
                <Actions
                  clickedSave={saveToDatabase}
                  clickedCancel={() => history.push('/todoviewer')}
                  clickedDelete={deleteThisTodo}
                  delDisabled={state.fetchTodoId ? false : true}
                />
              </Col>
            </Row>
            <InputComponent
              inputRef={inputRef}
              addItem={addItem}
              keyPressed={checkKeyEvent}
              clicked={addItem}
            />
            {state.error ? (
              <Row className="mt-3">
                <Col className="col-12 col-md-3 offset-md-3 pl-md-5">
                  <Alert type={state.errorType} message={state.error} />
                </Col>
              </Row>
            ) : null}
            <Row className="mt-3 mt-lg-5">
              <Col className="col-12 col-lg-5 offset-6 pl-4 offset-lg-6">
                {deleteButton}
              </Col>
            </Row>
            <TodoList body={tableBody} />
          </Container>
        )}
    </>
  );
}

export default TodoEditor;

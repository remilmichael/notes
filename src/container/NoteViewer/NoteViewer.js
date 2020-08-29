import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import * as actions from "../../store/actions/index";
import SpinnerAndButton from "../../component/UI/SpinnerAndButton/SpinnerAndButton";
import classes from "./NoteViewer.module.css";

class MainPage extends Component {
  componentDidMount() {
    this.fetchOrClearNotes();
  }

  componentDidUpdate() {
    this.fetchOrClearNotes();
  }

  /**
   * Function to fetch existing note titles from server or
   *     clear existing note titles from the redux store.
   * 
   * @function fetchOrClearNotes
   */
  fetchOrClearNotes() {
    if (this.props.notelist.length === 0 && !this.props.loading) {
      if (this.props.idToken !== null && !this.props.fetchFailed) {
        this.props.onFetchNotes(
          this.props.idToken,
          this.props.nextRecordNumber
        );
      }
    } else if (
      this.props.notelist.length !== 0 &&
      this.props.idToken === null
    ) {
      this.props.onClearNotes();
    }
  }

  /**
   * Function to fetch ${RECORD_COUNT} more titles from
   *    server
   * 
   * @function loadMoreNotesHandler
   */
  loadMoreNotesHandler = () => {
    this.props.onFetchNotes(this.props.idToken, this.props.nextRecordNumber);
  };

  render() {
    let noteList = null;
    let moreButton = null;
    if (this.props.notelist.length > 0) {
      noteList = this.props.notelist.map((note) => {
        return (
          <Col className="col-12 col-md-4 mt-3" key={note.noteId}>
            <Card bg="light" text="dark" data-test="component-note-item">
              <NavLink to={`/note?id=${note.noteId}`} className={classes.link}>
                <Card.Body>
                  <Card.Text>{note.noteHeading}</Card.Text>
                </Card.Body>
              </NavLink>
            </Card>
          </Col>
        );
      });
    }

    if (this.props.hasMoreNotes && this.props.idToken) {
      if (this.props.fetchFailed) {
        moreButton = (
          <SpinnerAndButton
            data-test="component-button-failed"
            disabled={true}
            variant="secondary"
            message="Unable to connect"
            clickedMore={this.loadMoreNotesHandler}
          />
        );
      } else if (!this.props.loading) {
        moreButton = (
          <SpinnerAndButton
            data-test="component-loadmore"
            disabled={false}
            variant="primary"
            message="Load more"
            clickedMore={this.loadMoreNotesHandler}
          />
        );
      } else {
        moreButton = (
          <SpinnerAndButton
            data-test="component-loading"
            disabled={true}
            variant="primary"
            message=" Loading..."
          />
        );
      }
    }

    let addNewComponent = (
      <>
        <Row className="mt-3">
          <Col>
            <NavLink to="/note">
              <button
                data-test="component-addbutton"
                type="button"
                className="btn btn-dark"
              >
                New note
              </button>
            </NavLink>
          </Col>
        </Row>
      </>
    );
    return (
      <Container>
        {addNewComponent}
        <Row>{noteList}</Row>
        <Row className="mt-5 justify-content-center">
          <Col></Col>
          <Col>{moreButton}</Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}

export const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    idToken: state.auth.idToken,
    notelist: state.notelist.notes,
    nextRecordNumber: state.notelist.nextRecordNumber,
    hasMoreNotes: state.notelist.hasMoreNotes,
    loading: state.notelist.loading,
    fetchFailed: state.notelist.fetchFailed,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onFetchNotes: (idToken, nextRecordNumber) =>
      dispatch(actions.fetchAllNotes(idToken, nextRecordNumber)),
    onClearNotes: () => dispatch(actions.clearTitles()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

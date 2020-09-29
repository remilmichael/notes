import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import * as actions from '../../store/actions/index';
import Spinner from '../../component/UI/Spinner/Spinner';
import Alert from '../../component/UI/Alert/Alert';
import Actions from './Action/Action';
import Input from './Input/Input';
import { ROOT_URL, decrypt } from '../../utility';

class NoteEditor extends Component {

    source = axios.CancelToken.source();

    constructor(props) {
        super(props)
        this.errorTimeout = null;
        this.urlParam_Id = null;
        if (this.props.location && this.props.location.search) {
            this.urlParams = new URLSearchParams(this.props.location.search);
            this.urlParam_Id = this.urlParams.get("id");
        }
    }

    /**
     * State variable of `NoteEditor` component
     */
    state = {
        noteId: null,
        heading: '',
        note: '',
        lastUpdated: null,
        error: null,
        errorAck: false, // Set to true, when error has been acknowledged properly, since errors will be fade after few seconds, to avoid re-rendering due to that.
        fetchingNow: false
    };

    componentDidMount() {
        if (!this.props.userId) {
            this.props.onRaiseWarning("Login to continue!", "warning");
        }

        if (!this.state.noteId && this.urlParam_Id) {
            this.setState({ noteId: this.urlParam_Id, fetchingNow: true });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.errorTimeout);
        this.source.cancel();
    }

    componentDidUpdate() {
        if (this.props.dbActionSuccessful) {
            this.props.onResetToDefault();
        }
        if (this.props.error && !this.state.error && !this.state.errorAck) {
            this.setState({ error: this.props.error, errorAck: true });
        }
        if (this.state.fetchingNow) {
            this.fetchNoteFromDb();
        }
    }

    /**
     * Function which is called whenever the value in input components change.
     * 
     * @function formInputHandler
     * @param {Object} event - Event object to get the current content in input components
     */
    formInputHandler = (event) => {
        if (event.target.id === 'notearea') this.setState({ note: event.target.value });
        else if (event.target.id === 'noteheading') {
            this.setState({ heading: event.target.value });
        }
    }

    /**
     * Function to check if note to be fetched from server, if required
     *      calls fetchNoteHandler() function
     * 
     * @function fetchNoteFromDb
     */
    fetchNoteFromDb = async () => {
        if (this.props.userId && this.state.note.length === 0 && !this.state.error) {
            this.fetchNoteHandler();
        }
    }


    /**
     * Function to fetch the note with the given `noteId` from the server
     * 
     * @function fetchNoteHandler
     */
    fetchNoteHandler = async () => {
        let response;
        let data;

        try {
            response = await axios.get(`${ROOT_URL}/notes/${this.state.noteId}`,
                { withCredentials: true, cancelToken: this.source.token });
            data = await response.data;
        } catch (error) {
            if (!axios.isCancel(error)) {
                this.setState({
                    fetchingNow: false,
                    error: "Failed to fetch note"
                });
            }
        }

        if (data) {
            let noteId = response.data["noteId"];
            let heading = response.data["noteHeading"];
            let noteBody = response.data["noteBody"];
            let lastUpdated = response.data["lastUpdated"];

            if (noteId && heading && noteBody && lastUpdated) {
                heading = decrypt(heading, this.props.encryptionKey);
                noteBody = decrypt(noteBody, this.props.encryptionKey);
                this.setState({
                    noteId: noteId,
                    heading: heading,
                    note: noteBody,
                    lastUpdated: lastUpdated,
                    fetchingNow: false
                })
            } else {
                this.setState({
                    fetchingNow: false,
                    error: 'Something went wrong'
                })
            }
        }
    }

    /**
     * Function to perform validation on `click` event of `Save` button
     *      and calls saveNoteHandler() to push it to the server.
     * 
     * @function checkNoteValidity
     */
    checkNoteValidity = () => {
        if (!this.state.note || this.state.note.trim() === '') {
            this.setState({
                error: "Note can't be empty"
            })
        } else if (this.state.note.length > 48000) {
            // Max. length is set to 48,000 characters.
            this.setState({
                error: `Maximum characters allowed in a single note is 48000. Current count: ${this.state.note.length}`
            })
        } else if (!this.state.heading || this.state.heading.trim() === '') {
            let heading = "";
            if (this.state.note.length <= 10) {
                heading = this.state.note;
            } else {
                heading = this.state.note.slice(0, 10);
            }
            this.setState({ heading: heading }, () => {
                this.saveNoteHandler();
            });
        } else if (this.state.heading.length > 150) {
            // Max. length is set to 150 characters.
            this.setState({
                error: `Maximum characters for heading is 150. Current count ${this.state.heading.length}`
            });
        } else {
            this.saveNoteHandler();
        }
    }

    /**
     * Function which creates a note object and calls the redux
     *      action creator to store it to the server.
     * 
     * @function saveNoteHandler
     */
    saveNoteHandler = () => {
        let note = {
            noteId: this.state.noteId,
            noteHeading: this.state.heading,
            noteBody: this.state.note,
            userId: this.props.userId,
            lastUpdated: new Date().getTime()
        };
        if (this.state.noteId === null) {
            note.noteId = uuidv4();
            this.props.onSaveNote(note, this.props.encryptionKey);
        } else {
            this.props.onUpdateNote(note, this.props.encryptionKey);
        }
    }

    /**
     * Function to redirect to base url
     * 
     * @function cancelNoteHandler
     */
    cancelNoteHandler = () => {
        this.props.history.push('/');
    }

    /**
     * Function to delete the note when `delete` button is clicked.
     * 
     * @function deleteNoteHandler
     */
    deleteNoteHandler = () => {
        if (this.state.noteId !== null && this.props.userId !== null) {
            this.props.onDeleteNote(this.state.noteId);
        }
    }

    render() {
        // console.log("Inside rendering function => [NoteEditor.js]");
        let dispComponent = null;

        if (this.props.dbActionSuccessful) {
            dispComponent = <Redirect data-test="component-redirect-plain" to="/" />;
        }
        else if (!this.props.userId) {
            if (this.urlParam_Id) {
                dispComponent = <Redirect data-test="component-redirect-param" to={`/login?redirect=note?id=${this.urlParam_Id}`} />;
            } else {
                dispComponent = <Redirect data-test="component-redirect-plain" to="/login?redirect=note" />;
            }

        }
        else if (this.props.isStoringNow || this.state.fetchingNow === true) {
            dispComponent = <Spinner data-test="component-spinner" />;
        } else {
            dispComponent = (
                <Row>
                    <Col className="col-12 offset-0 col-lg-6 offset-lg-3  text-center justify-content-center">
                        <Input data-test="component-inputform" formChanged={this.formInputHandler} heading={this.state.heading} body={this.state.note} />
                        <Row>
                            <Col>
                                {
                                    this.state.error
                                        ?
                                        <Alert
                                            data-test="component-alert"
                                            type="danger"
                                            message={this.state.error} />
                                        :
                                        null
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-lg-3 mt-3 mt-lg-0">
                        <Actions
                            data-test="component-action"
                            clickedSave={this.checkNoteValidity}
                            clickedCancel={this.cancelNoteHandler}
                            clickedDelete={this.deleteNoteHandler}
                            delDisabled={this.state.noteId === null}
                        />
                    </Col>
                </Row>
            );
        }

        if (this.state.error) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = setTimeout(() => {
                this.setState({ error: null })
            }, 5000);
        }

        return (
            <>
                <Container fluid className="mt-4">
                    {dispComponent}
                </Container>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        encryptionKey: state.auth.secretKey,
        isStoringNow: state.note.loadingNow,
        error: state.note.error,
        dbActionSuccessful: state.note.saveSuccessful,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveNote: (note, encryptionKey) => dispatch(actions.saveNote(note, encryptionKey)),
        onUpdateNote: (note, encryptionKey) => dispatch(actions.updateNote(note, encryptionKey)),
        onDeleteNote: (noteId) => dispatch(actions.deleteNote(noteId)),
        onResetToDefault: () => dispatch(actions.resetToDefault()),
        onRaiseWarning: (message, type) => dispatch(actions.setMessage(message, type)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
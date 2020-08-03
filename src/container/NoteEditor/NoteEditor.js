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
import { ROOT_URL } from '../../axios-notes';

class NoteEditor extends Component {

    source = axios.CancelToken.source();

    constructor(props) {
        super(props);
        this.errorTimeout = null;
        this.urlParam_Id = null;
        if (this.props.location && this.props.location.search) {
            this.urlParams = new URLSearchParams(this.props.location.search);
            this.urlParam_Id = this.urlParams.get("id");
        }
    }


    state = {
        heading: '',
        note: '',
        lastUpdated: null,
        error: null,
        errorAck: false, // Set to true, when error has been acknowledged properly, since errors are faded after few seconds, to avoid re-rendering due to that.
        noteId: null,
        fetchingNow: false
    };

    componentDidMount () {
        if (!this.props.idToken) {
            this.props.onRaiseWarning("Login to continue!", "warning");
        }

        
        if (!this.state.noteId && this.urlParam_Id) {
            this.setState({ noteId: this.urlParam_Id, fetchingNow: true });
        }
    }

    componentWillUnmount () {
        clearTimeout(this.errorTimeout);
        this.source.cancel();
    }

    componentDidUpdate () {
        if (this.props.dbActionSuccessful) {
            this.props.onResetToDefault();
        }
        if (this.props.error && !this.state.error && !this.state.errorAck) {
            this.setState({error: this.props.error, errorAck: true});
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
        if (event.target.id === 'notearea') this.setState({note: event.target.value});
        else if (event.target.id === 'noteheading') {
            this.setState({heading: event.target.value});
        }
    }

    /**
     * Function to check if note to be fetched from server, if required
     *      calls fetchNoteHandler() function
     * 
     * @function fetchNoteFromDb
     */
    fetchNoteFromDb = async () => {
        if (this.props.idToken && this.state.note.length === 0 && !this.state.error) {
            this.fetchNoteHandler();
        }
    }


    /**
     * Function to fetch the note with the given `noteId` from the server
     * 
     * @function fetchNoteHandler
     */
    fetchNoteHandler = async() => {      
        let response;
        let data;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.idToken
        }
        
        try {
            response = await axios.get(`${ROOT_URL}/notes/${this.state.noteId}`,
                 { headers: headers, cancelToken: this.source.token });
            data = await response.data;
        } catch(error) {
            if (!axios.isCancel(error)) {
                this.setState({
                    fetchingNow: false,
                    error: "Failed to fetch note"
                });
            }
        }

        if (data) {
            this.setState({
                noteId: response.data["noteId"],
                heading: response.data["noteHeading"],
                note: response.data["noteBody"],
                lastUpdated: response.data["lastUpdated"],
                fetchingNow: false
            });
        }
    }

    /**
     * Function to perform validation on `click` event of `Save` button
     *      and calls saveNoteHandler() to push it to the server.
     * 
     * @function checkNoteValidity
     */
    checkNoteValidity = () => {
        if (this.state.note === null || this.state.note.trim() === '') {
            this.setState({
                error: "Note can't be empty"
            })
        } else if (this.state.heading === null || this.state.heading.trim() === '' ) {
            let heading = "";
            if (this.state.note.length <= 10) {
                heading = this.state.note;
            } else {
                heading = this.state.note.slice(0, 10);
            }
            this.setState({heading: heading}, () => {
                // call this function only after the state gets updated.
                this.saveNoteHandler(); 
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
            this.props.onSaveNote(note, this.props.idToken);
        } else {
            this.props.onUpdateNote(note, this.props.idToken);
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
        if (this.state.noteId !== null && this.props.idToken !== null) {
            this.props.onDeleteNote(this.state.noteId, this.props.idToken);
        }
    }

    render () {
        // console.log("Inside rendering function => [NoteEditor.js]");
        let dispComponent = null;

        if (this.props.dbActionSuccessful) {
            dispComponent = <Redirect data-test="component-redirect-plain" to="/" />;
        }
        else if (!this.props.idToken) {
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
            this.errorTimeout = setTimeout(()=> {
                    this.setState({error: null})
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
        isStoringNow: state.note.loadingNow,
        error: state.note.error,
        dbActionSuccessful: state.note.saveSuccessful,
        idToken: state.auth.idToken,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveNote: (note, idToken) => dispatch(actions.saveNote(note, idToken)),
        onUpdateNote: (note, idToken) => dispatch(actions.updateNote(note, idToken)),
        onDeleteNote: (noteId, idToken) => dispatch(actions.deleteNote(noteId, idToken)),
        onResetToDefault: () => dispatch(actions.resetToDefault()),
        onRaiseWarning: (message, type) => dispatch(actions.setMessage(message, type)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Actions from './Action/Action';
import Input from './Input/Input';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import * as actions from '../../store/actions/index';
import Spinner from '../../component/UI/Spinner/Spinner';
import Alert from '../../component/UI/Alert/Alert';
import axios from 'axios';
import { ROOT_URL } from '../../axios-notes';

class NoteEditor extends Component {

    source = axios.CancelToken.source();

    constructor(props) {
        super(props);
        this.errorTimeout = null;
        this.urlParams = new URLSearchParams(this.props.location.search);
        this.urlParam_Id = this.urlParams.get("id");
    }


    state = {
        heading: '',
        note: '',
        lastUpdated: null,
        error: null,
        errorAck: false, // Set to true, when error has been acknowledged properly, since errors are faded after few seconds, to avoid re-rendering due to that.
        noteId: null,
        fetchNote: true,
        fetchingNow: false
    };

    componentDidMount () {
        if (this.state.noteId === null) {
            const urlparams = new URLSearchParams(this.props.location.search);
            const noteId = urlparams.get("id");
            if (noteId !== null) {
                this.setState({
                    noteId: urlparams.get("id"),
                    fetchingNow: true
                });
            }
        }

        if (!this.props.idToken) {
            this.props.onRaiseWarning("Login to continue!", "warning");
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
        if (this.state.fetchingNow === true) {
            this.fetchNoteHandler();
        }
    }

    formInputHandler = (event) => {
        if (event.target.id === 'notearea') this.setState({note: event.target.value});
        else if (event.target.id === 'noteheading') {
            this.setState({heading: event.target.value});
        }
    }

    fetchNoteHandler = () => {
        if (this.state.noteId !== null && this.props.idToken !== null && this.state.note.length === 0 && this.state.error === null) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.idToken
            }
            axios.get(`${ROOT_URL}/notes/${this.state.noteId}`, {
                headers: headers,
                cancelToken: this.source.token
            })
            .then(response => {
                this.setState({
                    noteId: response.data["noteId"],
                    heading: response.data["noteHeading"],
                    note: response.data["noteBody"],
                    lastUpdated: response.data["lastUpdated"],
                    fetchingNow: false
                });
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    this.setState({
                        fetchingNow: false,
                        error: "Failed to fetch note"
                    });
                }
            })
        }
    }

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
                this.saveNoteHandler(); //call this function only when the state gets updated.
            });
        } else {
            this.saveNoteHandler();
        }
    }

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

    cancelNoteHandler = () => {
        this.props.history.push('/');
    }

    deleteNoteHandler = () => {
        if (this.state.noteId !== null && this.props.idToken !== null) {
            this.props.onDeleteNote(this.state.noteId, this.props.idToken);
        }
    }

    render () {

        console.log("Inside rendering function => [NoteEditor.js]");

        let dispComponent = null;

        if (this.props.dbActionSuccessful) {
            dispComponent = <Redirect to="/" />;
        }
        else if (!this.props.idToken) {
            if (this.urlParam_Id) {
                dispComponent = <Redirect to={`/login?redirect=note?id=${this.urlParam_Id}`} />;
            } else {
                dispComponent = <Redirect to="/login?redirect=note" />;
            }
            
        } 
        else if (this.props.isStoringNow || this.state.fetchingNow === true) {
            dispComponent = <Spinner />;
        } else {
            dispComponent = (
                <Row>
                    <Col className="col-12 offset-0 col-lg-6 offset-lg-3  text-center justify-content-center">
                        <Input formChanged={this.formInputHandler} heading={this.state.heading} body={this.state.note} />
                        <Row>
                            <Col>
                                {this.state.error ? <Alert type="danger" message={this.state.error} /> : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-lg-3 mt-3 mt-lg-0">
                        <Actions 
                            clickedSave={this.checkNoteValidity} 
                            clickedCancel={this.cancelNoteHandler}
                            clickedDelete={this.deleteNoteHandler}
                            delDisabled={this.props.currentNoteId === null} 
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
        isEditingExisting: state.note.isEditingExisting,
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
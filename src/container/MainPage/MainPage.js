import React, { Component } from 'react';
import { Container, Row, Col, Card} from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import SpinnerOrButton from './Actions/SpinnerOrButton';

class MainPage extends Component {

    componentDidMount() {
        console.log('ComponentDidMount -> MainPage.js');
        console.log(this.props.loading);
        if (this.props.notelist.length === 0 && this.props.loading === false) {
            if (this.props.idToken !== null) {
                this.props.onFetchNotes(this.props.idToken, this.props.pageNumber);
            }
        } else if (this.props.notelist.length !== 0 && this.props.idToken === null) {
            this.props.onClearNotes();
        }
    }

    componentDidUpdate() {
        console.log("componentDidUpdate -> MainPage");
        if (this.props.notelist.length === 0 && this.props.loading === false) {
            if (this.props.idToken !== null) {
                this.props.onFetchNotes(this.props.idToken, this.props.pageNumber);
            }
        } else if (this.props.notelist.length !== 0 && this.props.idToken === null) {
            this.props.onClearNotes();
        }
    }

    loadMoreNotesHandler = () => {
        this.props.onFetchNotes(this.props.idToken, this.props.pageNumber);
    }

    render () {
        console.log('Inside rendering function => [MainPage.js]');
        let noteList = null;
        let moreButton = null;
        if (this.props.notelist.length > 0) {
            noteList = this.props.notelist.map((note) => {
                    return (<Col className="col-12 col-md-4 mt-3" key={note.noteId}>
                            <Card bg="light" text="dark">
                                <NavLink to={'/note?id='.concat(note.noteId)}>
                                    <Card.Body>
                                        <Card.Text>
                                            {note.noteHeading}
                                        </Card.Text>
                                    </Card.Body>
                                </NavLink>
                            </Card>
                        </Col>);
            }); 
        }

        if (this.props.hasMoreNotes === true && this.props.idToken !== null)  {
            if (this.props.loading === false) {
                moreButton = <SpinnerOrButton disabled={false} message="Load more" clickedMoreNotes={this.loadMoreNotesHandler} />;
            } else {
                moreButton = <SpinnerOrButton disabled={true} message=" Loading..." />;
            }
        }

        let addNewComponent = (
            <>
                <Row className="mt-3">
                    <Col>
                        <NavLink to="/note">
                            <button type="button" className="btn btn-dark">New note</button>
                        </NavLink>
                    </Col>
                </Row>
            </>    
        );
        return (
            <Container>
                {addNewComponent}
                <Row>
                    {noteList}
                </Row>
                <Row className="mt-5 justify-content-center">
                    <Col></Col>
                    <Col>
                        {moreButton}
                    </Col>
                    <Col></Col>
                </Row>
            </Container>  
        );
    }
}

export const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        idToken: state.auth.idToken,
        notelist: state.notelist.notes,
        pageNumber: state.notelist.currentPage,
        hasMoreNotes: state.notelist.hasMoreNotes,
        loading: state.notelist.loading
    };
}

export const mapDispatchToProps = dispatch => {
    return {
        onFetchNotes: (idToken, pageNumber) => dispatch(actions.fetchAllNotes(idToken, pageNumber)),
        onClearNotes: () => dispatch(actions.clearTitles())
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
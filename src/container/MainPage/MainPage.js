import React, { Component } from 'react';
import { Container, Row, Col, Card} from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../../store/actions/index';

class MainPage extends Component {

    state = {
        checkNotes: true,
    }

    componentDidMount() {
        if (this.props.notelist.length === 0 && this.state.checkNotes === true) {
            if (this.props.idToken !== null) {
                this.props.onFetchNotes(this.props.idToken);
            }
        } else if (this.props.notelist.length !== 0 && this.props.idToken === null) {
            this.props.onClearNotes();
        }
    }

    componentDidUpdate() {
        if (this.props.notelist.length === 0 && this.state.checkNotes === true) {
            console.log("componentDidUpdate -> MainPage");
            if (this.props.idToken !== null) {
                this.props.onFetchNotes(this.props.idToken);
            }
            this.setState({
                checkNotes: false
            });
        } else if (this.props.notelist.length !== 0 && this.props.idToken === null) {
            this.props.onClearNotes();
        }
    }

    render () {
        console.log('Inside rendering function => [MainPage.js]');
        let noteList = null;
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
            </Container>  
        );
    }
}

export const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        idToken: state.auth.idToken,
        notelist: state.notelist.notes,
        pageRefresh: state.notelist.refresh
    };
}

export const mapDispatchToProps = dispatch => {
    return {
        onFetchNotes: (idToken) => dispatch(actions.fetchAllNotes(idToken)),
        onClearNotes: () => dispatch(actions.clearTitles())
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
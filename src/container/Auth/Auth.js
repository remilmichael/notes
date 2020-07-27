import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import AuthPresentationalComponents from './AuthComponents';
import Spinner from '../../component/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import Alert from '../../component/UI/Alert/Alert';


class Auth extends Component {

    state = {
        username: null,
        password: null,
        error: null,
        errorType: null, // For setting the error message color
        errorAck: false // Set to true, when error has been acknowledged properly, since errors are faded after few seconds,
                        // to avoid re-rendering due to that.
    }

    componentDidMount () {
        this._mounted = true;
        if (this.props.message) {
            this.props.onClearMessage();
            this.setState({error: this.props.message, errorType: this.props.msgType})
        }
    }
    
    componentDidUpdate () {
        if (!this.state.error && this.props.authError) {
            this.setState({ error: this.props.authError, errorType: "danger"});
            this.props.onClearError();
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    usernameChangeHandler = (event) => {
        this.setState({username: event.target.value});
    }

    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value});
    }

    loginHandler = () => {
        if (this.state.username === null || this.state.username.trim() === '') {
            this.setState({error: "Username can't be empty", errorType: "warning"});
        } else if (this.state.password === null || this.state.password.trim() === '') {
            this.setState({error: "Password can't be empty", errorType: "warning"});
        } else {
            const credential = {
                username: this.state.username,
                password: this.state.password
            };
            this.props.onLogin(credential);
        }
    }

    goBackHandler = () => {
        this.props.history.push('/');
    }

    render () {
        let currentLoginComponent = null;
        if (this.props.isAuthenticated) {
            let redirectPath;
            let query = new URLSearchParams(this.props.location.search);
            redirectPath = query.get('redirect');
            if (redirectPath === null) redirectPath = '/';
            currentLoginComponent = <Redirect to={redirectPath} />;
            // this.props.history.goBack();
        } else if (this.props.isLoggingNow) {
            currentLoginComponent = <Spinner />;
        } else {
            currentLoginComponent = (
                <AuthPresentationalComponents 
                    userNameChanged={this.usernameChangeHandler} 
                    passwordChanged={this.passwordChangeHandler} 
                    loginClicked={this.loginHandler}
                    cancelClicked={this.goBackHandler}
                />
            );
        }

        if (this.state.error) {
            setTimeout(() => {
                if (this._mounted) {
                    this.setState({error: null, errorType: null});
                }
            }, 3000);
        }

        return (
            <React.Fragment>
                <Container className="mt-5 pt-2">
                    <Row>
                        <Col className={'col-12 offset-0 col-md-5 offset-md-4'}>
                            {currentLoginComponent}
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col className="col-md-5 offset-md-4 text-center">
                            {this.state.error ? <Alert type={this.state.errorType} message={this.state.error}/> : null}
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );  
    }
}

export const mapStateToProps = state => {
    return {
        isLoggingNow: state.auth.logging,
        isAuthenticated: state.auth.idToken !== null,
        authError: state.auth.error,
        message: state.message.message,
        msgType: state.message.type
    };
}

export const mapDispatchToProps = dispatch => {
    return {
        onLogin: (credential) => dispatch(actions.authUser(credential)),
        onClearError : () => dispatch(actions.clearError()),
        onClearMessage: () => dispatch(actions.unsetMessage())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
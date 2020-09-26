import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import SigninComponent from './SigninComponent/SigninComponent';
import Spinner from '../../../component/UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';
import classes from './Signin.module.css';

class Auth extends Component {

    errorTimeout = null;

    state = {
        rememberMe: false,
        username: null,
        password: null,
        error: null,
        errorType: null, // For setting the error message type
        errorAck: false // Set to true, when error has been acknowledged properly, since errors are faded after few seconds,
        // to avoid re-rendering due to that.
    }

    componentDidMount() {
        if (this.props.message) {
            this.props.onClearMessage();
            this.setState({ error: this.props.message, errorType: this.props.msgType })
        }
    }

    componentDidUpdate() {
        if (this.props.authError) {
            this.setState({ error: this.props.authError, errorType: "danger" });
            this.props.onClearError();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.errorTimeout);
    }

    usernameChangeHandler = (event) => {
        this.setState({ username: event.target.value });
    }

    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value });
    }

    /**
     * Function to start sign-in process 
     * 
     * @function loginHandler
     * @param {Event} event - Event object
     */
    loginHandler = (event) => {
        event.preventDefault();
        if (this.state.username === null || this.state.username.trim() === '') {
            this.setState({ error: "Username can't be empty", errorType: "warning" });
        } else if (this.state.password === null || this.state.password.trim() === '') {
            this.setState({ error: "Password can't be empty", errorType: "warning" });
        } else {
            const credential = {
                username: this.state.username,
                password: this.state.password
            };
            this.props.onLogin(credential, this.state.rememberMe);
        }
    }

    /**
     * Function to navigate to home page
     * 
     * @function goBackHandler
     */
    goBackHandler = () => {
        this.props.history.push('/');
    }

    /**
     * Function to update the 'Remember me' checkbox
     *      checked status
     * 
     * @function rememberMeHandler
     * @param {Event} event 
     */
    rememberMeHandler = (event) => {
        this.setState({
            rememberMe: event.target.checked
        });
    }

    render() {
        let currentLoginComponent = null;
        if (this.props.isAuthenticated) {
            let redirectPath = '/';
            if (this.props.location && this.props.location.search) {
                let query = new URLSearchParams(this.props.location.search);
                redirectPath = query.get('redirect');
            }
            currentLoginComponent = <Redirect data-test="component-redirect" to={redirectPath} />;
        } else if (this.props.isLoggingNow) {
            currentLoginComponent = <Spinner data-test="component-spinner" />;
        } else {
            currentLoginComponent = (
                <SigninComponent
                    data-test="component-loginform"
                    userNameChanged={this.usernameChangeHandler}
                    passwordChanged={this.passwordChangeHandler}
                    loginClicked={(event) => this.loginHandler(event)}
                    cancelClicked={this.goBackHandler}
                    rememberMe={(event) => this.rememberMeHandler(event)}
                />
            );
        }

        if (this.state.error) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = setTimeout(() => {
                this.setState({ error: null, errorType: null });
            }, 3000);
        }

        return (
            <>
                {
                    currentLoginComponent
                }
                {
                    this.state.error
                        ?
                        <div
                            className={classes.Alert}
                            data-test="component-alert">
                            {this.state.error}
                        </div>
                        :
                        null
                }
            </>
        );
    }
}

export const mapStateToProps = state => {
    return {
        isLoggingNow: state.auth.logging,
        isAuthenticated: state.auth.userId !== null,
        authError: state.auth.error,
        message: state.message.message,
        msgType: state.message.type
    };
}

export const mapDispatchToProps = dispatch => {
    return {
        onLogin: (credential, rememberMe) => dispatch(actions.authUser(credential, rememberMe)),
        onClearError: () => dispatch(actions.clearError()),
        onClearMessage: () => dispatch(actions.unsetMessage())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
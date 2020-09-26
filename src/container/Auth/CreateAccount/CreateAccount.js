import React from 'react';
import CryptoJS from 'crypto-js';
import bcryptjs from 'bcryptjs';
import axios from 'axios';

import Axios from '../../../axios-notes';
import { ReactComponent as GreenTick } from '../../../assets/greentick.svg'
import classes from './CreateAccount.module.css';

function CreateAccount() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRetry, setPasswordRetry] = React.useState('');
    const [currentEventIndex, setCurrentEventIndex] = React.useState(-1);
    const [error, setError] = React.useState(null);
    const [disableInput, setDisableInput] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const source = React.useRef(null);

    if (!source.current) {
        source.current = axios.CancelToken.source();
    }

    const signupEvents = [
        'Checking username',
        'Creating secret keys',
        'Creating user account'
    ];

    React.useEffect(() => {
        document.title = 'Create an account';

        return () => {
            if (source.current) {
                source.current.cancel('Unmounted');
            }
        }
    }, [])

    /**
     * Function to reset the form
     * 
     * @function resetForm
     * @param {MouseEvent|KeyboardEvent} event - Click/KeyPress event on button
     */
    const resetForm = (event) => {
        event.preventDefault();
        setUsername('');
        setPassword('');
        setPasswordRetry('');
    }

    /**
     * Function to perform form validation
     * 
     * @function submitForm
     * @param {MouseEvent} event 
     */
    const submitForm = (event) => {
        event.preventDefault();
        setError(null);
        if (username.trim().length === 0) {
            setError(`Username can't be empty`);
        } else if (username.trim().length < 5) {
            setError(`Username should be atleast 5 characters long`);
        } else if (password.trim().length < 8) {
            setError('Password should be atleast 8 characters long');
        } else if (password.trim().length > 32) {
            setError('Password max. length is 32 characters');
        } else if (passwordRetry !== password) {
            setError('Passwords does not match');
        } else {
            setDisableInput(true);
            createAccount();
        }
    }

    /**
     * Function to generate keys and submit details 
     *      to the server.
     * 
     * @function createAccount
     */
    const createAccount = async () => {
        let userExists = true;
        try {
            setCurrentEventIndex((index) => index + 1);
            const requestBody = {
                username: username
            }
            const response = await Axios.post('/check-username', requestBody,
                { cancelToken: source.current.token });
            if (response) {
                if (response.data === true) {
                    setCurrentEventIndex(-1);
                    setError('Username already taken');
                } else if (response.data === false) {
                    userExists = false;
                }
            } else {
                setError('Something went wrong')
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                setCurrentEventIndex(-1);
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message)
                } else {
                    setError('Something went wrong');
                }
            }
        }

        if (!userExists) {
            setCurrentEventIndex((index) => index + 1);
            const salt = CryptoJS.lib.WordArray.random(128 / 8);
            const key = CryptoJS.PBKDF2(username + password + new Date().getTime(), salt, {
                keySize: 256 / 32,
            });
            const encryptedKey = CryptoJS.AES.encrypt(key.toString(), password); // 128 chars Base64
            const hmac = CryptoJS.HmacSHA256(encryptedKey.toString(), username + password); // 64 chars Base64
            const finalKey = hmac.toString() + encryptedKey.toString();
            const hashedPassword = bcryptjs.hashSync(password, 10);

            const requestObject = {
                username: username,
                password: hashedPassword,
                secretKey: finalKey,
                creationTimestamp: new Date().getTime()
            }
            setCurrentEventIndex((index) => index + 1);
            try {
                const response = await Axios.post('/create-account', requestObject,
                    { cancelToken: source.current.token });
                if (response) {
                    setCurrentEventIndex(-1);
                    setSuccess(true);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setCurrentEventIndex(-1);
                    if (error.response && error.response.data && error.response.data.message) {
                        setError(error.response.data.message)
                    } else {
                        setError('Something went wrong');
                    }
                }
            }
        }
    }

    return (
        <main>
            <form className={classes.SignupForm} name="signup_form">
                <h1>Signup</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    required
                    disabled={disableInput}
                    onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    required
                    disabled={disableInput}
                    onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="confirm-password">Re-enter password</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm password"
                    value={passwordRetry}
                    required
                    disabled={disableInput}
                    onChange={(e) => setPasswordRetry(e.target.value)} />

                {
                    error ?
                        <p className={classes.SignupForm_error} data-testid="error-message">{error}</p>
                        :
                        null
                }

                <div className={classes.SignupForm_buttonPalette}>
                    <button
                        id="resetButton"
                        disabled={disableInput}
                        onClick={(event) => resetForm(event)}>Reset</button>
                    <button
                        id="createButton"
                        disabled={disableInput}
                        onClick={(event) => submitForm(event)}>Create Account</button>
                </div>
                {
                    currentEventIndex !== -1 ?
                        <div className={classes.SignupForm_signupProgress}>
                            <p>{signupEvents[currentEventIndex]}</p>
                        </div>
                        :
                        null
                }
                {
                    success ?
                        <div className={classes.SignupForm_successMessage}>
                            <div>User account Created. Login now!</div>
                            <div className={classes.SignupForm_successMessage__tick}><GreenTick data-testid="greentick" /></div>
                        </div>
                        :
                        null
                }
            </form>
        </main>
    )
}

export default CreateAccount

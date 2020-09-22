import React from 'react';

import classes from './CreateAccount.module.css';

function CreateAccount() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRetry, setPasswordRetry] = React.useState('');
    const [currentEventIndex, setCurrentEventIndex] = React.useState(0);

    const signupEvents = [
        'Checking username',
        'Creating secret keys',
        'Saving to database'
    ];

    React.useEffect(() => {
        document.title = 'Create an account';
    }, [])

    const resetForm = (event) => {
        event.preventDefault();
        setUsername('');
        setPassword('');
        setPasswordRetry('');
    }

    const submitForm = (event) => {
        event.preventDefault();
    }
    return (
        <main>
            <form className={classes.Form}>
                <h1>Signup</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="confirm-password">Re-enter password</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm password"
                    value={passwordRetry}
                    onChange={(e) => setPasswordRetry(e.target.value)} />
                <div className={classes.Form_buttonPalette}>
                    <button id="reset" onClick={(event) => resetForm(event)}>Reset</button>
                    <button id="create" onClick={(event) => submitForm(event)}>Create Account</button>
                </div>
                {
                    currentEventIndex !== -1 ?
                        <div className={classes.Form_signupProgress}>
                            <p>{signupEvents[currentEventIndex]}</p>
                        </div>
                        :
                        null
                }
            </form>
        </main>
    )
}

export default CreateAccount

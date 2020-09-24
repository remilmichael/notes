import React from 'react';

import classes from './SigninComponent.module.css';

function Signin(props) {
    return (
        <form className={classes.LoginForm}>
            <h1>Signin</h1>
            <input
                type="text"
                id="username"
                spellCheck="false"
                placeholder="Username"
                onChange={props.userNameChanged}
            />
            <input
                type="password"
                id="password"
                spellCheck="false"
                placeholder="Password"
                onChange={props.passwordChanged}
            />
            <div className={classes.LoginForm_buttonPalette}>
                <button id="loginBtn" onClick={props.loginClicked}>
                    Login
                </button>
                <button id="cancelBtn" onClick={props.cancelClicked}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default Signin

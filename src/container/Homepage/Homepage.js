import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Homepage.module.css';

function Homepage() {
    return (
        <div className={classes.Container}>
            <div className={classes.Container__notes}>
                <NavLink
                    className={classes.Container__link}
                    to="/note"
                    exact>Add Notes</NavLink>
                <NavLink
                    className={classes.Container__link}
                    to="noteviewer"
                    exact>View Notes</NavLink>
            </div>
            <div className={classes.Container__todo}>
                <NavLink
                    className={classes.Container__link}
                    to="/todo"
                    exact>Add Todo</NavLink>
                <NavLink
                    className={classes.Container__link}
                    to="/todoviewer"
                    exact>View Todos</NavLink>
            </div>
        </div>
    )
}

export default Homepage

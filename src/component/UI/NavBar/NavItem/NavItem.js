import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavItem.module.css';

const navItem = (props) => {
    return (
        <NavLink className={classes.Navlink}
            to={props.link}
            exact
            activeClassName={classes.NavlinkActive}>
            {props.children}
        </NavLink>
    );
}

export default navItem;
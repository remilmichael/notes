import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

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

navItem.propTypes = {
    link: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
}
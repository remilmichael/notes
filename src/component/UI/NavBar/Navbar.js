import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import logo from '../../../assets/note.png';
import classes from './Navbar.module.css';
import NavItem from './NavItem/NavItem';

class Toolbar extends Component {
    render() {
        return (
            <Navbar
                data-test="component-navbar"
                collapseOnSelect
                expand="md"
                bg="dark"
                variant="dark">
                <Navbar.Brand>
                    <img
                        src={logo}
                        width="32"
                        height="32"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />{' '}
                    <span className={classes.BrandName}>NOTES</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {
                        this.props.isAuthenticated ?
                            <>
                                <Nav>
                                    <NavItem className={classes.NavbarItem} link="/">Home</NavItem>
                                </Nav>
                                <Nav>
                                    <NavItem className={classes.NavbarItem} link="/todo">Add Todo</NavItem>
                                </Nav>
                                <Nav>
                                    <NavItem className={classes.NavbarItem} link="/todoviewer">Todoviewer</NavItem>
                                </Nav>
                                <Nav>
                                    <NavItem className={classes.NavbarItem} link="/note">Add Note</NavItem>
                                </Nav>
                                <Nav>
                                    <NavItem className={classes.NavbarItem} link="/noteviewer">Noteviewer</NavItem>
                                </Nav>
                            </> : null
                    }
                    <Nav className="ml-auto">
                        {
                            this.props.isAuthenticated
                                ?
                                <NavItem
                                    data-test="link-logout"
                                    link="/logout">Logout</NavItem>
                                :
                                <NavItem
                                    data-test="link-login"
                                    link="/login">Login</NavItem>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
};

export const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.idToken !== null
    };
}

export default connect(mapStateToProps)(Toolbar);

Toolbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
}
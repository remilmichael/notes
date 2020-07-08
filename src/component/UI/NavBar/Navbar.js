import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../../assets/note.png';
import classes from './Navbar.module.css';
import NavItem from './NavItem/NavItem';
import { connect } from 'react-redux';

class Toolbar extends Component{
    render () {
        return (
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
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
                        <Nav className={classes.NavbarItem + ' mr-auto'}>
                            <NavItem link="/">Home</NavItem>
                        </Nav>
                        {/*<Nav className={classes.NavbarItem + ' md-auto'}>
                            {this.props.isAuthenticated ? <NavItem link="/note">Add Note</NavItem> : null}
                        </Nav>*/}
                        <Nav className={classes.NavbarItem + ' ml-auto'}>
                            {this.props.isAuthenticated ? <NavItem link="/logout">Logout</NavItem> : <NavItem link="/login">Login</NavItem>}
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
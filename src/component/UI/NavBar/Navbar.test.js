import React from 'react';

import Navbar from './Navbar';
import { checkProps, storeFactory, findByTestAttr, authInitialState } from '../../../testUtils';
import { shallow } from 'enzyme';

/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}, props={}) => {
    const store = storeFactory(initialState);
    return shallow(<Navbar store={store} { ...props } />).dive().dive();
};


describe('Checking prop types', () => {
    it('should not throw prop errors', () => {
        checkProps(Navbar, { isAuthenticated: true });
    });
});

describe('Rendering Navbar without authentication', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })
    it('should render the Navbar component', () => {
        const navbarComponent = findByTestAttr(wrapper, 'component-navbar');
        expect(navbarComponent.exists()).toBe(true);
    });

    it('should render the navlink for `Login`', () => {
        const link = findByTestAttr(wrapper, 'link-login');
        expect(link.exists()).toBe(true);
    });
});

describe('Rendering Navbar after authentication', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({ auth: { ...authInitialState, idToken: 'id123' } });
    })

    it('should render the Navbar component', () => {
        const navbarComponent = findByTestAttr(wrapper, 'component-navbar');
        expect(navbarComponent.exists()).toBe(true);
    });

    it('should render the navlink for `Logout`', () => {
        const link = findByTestAttr(wrapper, 'link-logout');
        expect(link.exists()).toBe(true);
    });
});
import React from 'react';
import { shallow } from 'enzyme';

import Auth from './Auth';
import { storeFactory, findByTestAttr } from '../../testUtils';


/**
 * Initial State of reducer `auth`
 */
const authInitialState = {
    userId: null,
    logging: false,
    idToken: null,
    expiresOn: null,
    authCheckComplete: false,
    error: null
};

/**
 * Initial state of reducer `message`
 */
const messageInitialState = {
    message: null,
    type: null
}


/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}) => {
    const store = storeFactory(initialState);
    return shallow(<Auth store={store} />).dive().dive();
}



describe('When user is `NOT` logged in', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({});
    });

    test('should render the `Container`', () => {
        const component = findByTestAttr(wrapper, 'component-container');
        expect(component.length).toBe(1);
    });
    test('should render `login form`', () => {
        const component = findByTestAttr(wrapper, 'component-loginform');
        expect(component.length).toBe(1);
    });
    test('should NOT render `Alert` component', () => {
        const component = findByTestAttr(wrapper, 'component-alert');
        expect(component.length).toBe(0);
    });
    test('should NOT render `Redirect` component', () => {
        const component = findByTestAttr(wrapper, 'component-redirect');
        expect(component.length).toBe(0);
    });
    test('should NOT render `Spinner` component', () => {
        const component = findByTestAttr(wrapper, 'component-spinner');
        expect(component.length).toBe(0);
    });
});

describe('When user is logged in', () => {

    const auth = {
        ...authInitialState,
        userId: '123',
        idToken: 'token232dbgv6v',
        expiresOn: new Date().setDate(new Date().getDate() + 1)
    }

    let wrapper;
    beforeEach(() => {
        wrapper = setup({auth: auth})
    });

    test('Should NOT render the `login form`', () => {
        const component = findByTestAttr(wrapper, 'component-loginform');
        expect(component.length).toBe(0);
    });
    test('should render `Redirect` component', () => {
        const component = findByTestAttr(wrapper, 'component-redirect');
        expect(component.length).toBe(1);
    });
    test('should NOT render `Spinner` component', () => {
        const component = findByTestAttr(wrapper, 'component-spinner');
        expect(component.length).toBe(0);
    });
});

describe('When `message` is set', () => {
    const message = {
        ...messageInitialState,
        message: 'Sample message',
        type: 'warning'
    };
    let wrapper;
    beforeEach(() => {
        wrapper = setup({message: message});
    });

    test('should render `Alert` component', () => {
        const component = findByTestAttr(wrapper, 'component-alert');
        expect(component.length).toBe(1);
    });
    test('should NOT render `Spinner` component', () => {
        const component = findByTestAttr(wrapper, 'component-spinner');
        expect(component.length).toBe(0);
    });
});
import React from 'react';
import { shallow } from 'enzyme';

import Auth from './Auth';
import { storeFactory, findByTestAttr, findByIdSelector } from '../../testUtils';


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
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}, props={}) => {
    const store = storeFactory(initialState);
    return shallow(<Auth store={store} { ...props } />).dive().dive();
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
        wrapper = setup({ auth: auth })
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


describe('When alert `message` is set', () => {
    const message = {
        ...messageInitialState,
        message: 'Sample message',
        type: 'warning'
    };
    let wrapper;
    beforeEach(() => {
        wrapper = setup({ message: message });
    });

    test('should render `login form`', () => {
        const component = findByTestAttr(wrapper, 'component-loginform');
        expect(component.length).toBe(1);
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

describe('When user is logging in - `loading`', () => {
    
    const auth = {
        ...authInitialState,
        logging: true
    };

    let wrapper;
    beforeEach(() => {
        wrapper = setup({ auth: auth });
    })

    test('should render `Spinner` component', () => {
        const component = findByTestAttr(wrapper, 'component-spinner');
        expect(component.length).toBe(1);
    });
    test('should NOT render `login component`', () => {
        const component = findByTestAttr(wrapper, 'component-loginform');
        expect(component.length).toBe(0);
    });
    test('should NOT render `Alert` component', () => {
        const component = findByTestAttr(wrapper, 'component-alert');
        expect(component.length).toBe(0);
    });

});

describe('Simulating events', () => {
    let wrapper, loginComponent;
    const username = 'user123';
    const password = 'pass123';
    const historyMock = { push: jest.fn() };
    beforeEach(() => {
        wrapper = setup({}, { history: historyMock });
        loginComponent = findByTestAttr(wrapper, 'component-loginform').dive();
    });

    describe('Change textfield value', () => {
    
        it('should update the state without error', () => {
            const usernameTF = findByIdSelector(loginComponent, 'username');
            const passwordTF = findByIdSelector(loginComponent, 'password');

            usernameTF.simulate('change', { target: { value: username }});
            passwordTF.simulate('change', { target: { value: password }});
            expect(wrapper.state('username')).toEqual(username);
            expect(wrapper.state('password')).toEqual(password);
        });
    });

    describe('Clicking the `login` button', () => {
        it('should update the `logging` value in `auth` reducer to `true`', () => {
            const usernameTF = findByIdSelector(loginComponent, 'username');
            const passwordTF = findByIdSelector(loginComponent, 'password');
            const loginBtn = findByIdSelector(loginComponent, 'loginBtn');
            
            usernameTF.simulate('change', { target: { value: username }});
            passwordTF.simulate('change', { target: { value: password }});
            loginBtn.simulate('click');
            const isLoading = wrapper.instance().props.store.getState().auth.logging;
            expect(isLoading).toBe(true);
        })
    });

    describe('Clicking the `cancel` button', () => {
        it('should push `/` into the history prop to redirect to homepage', () => {
            const cancelBtn = findByIdSelector(loginComponent, 'cancelBtn');
            cancelBtn.simulate('click');
            expect(historyMock.push.mock.calls[0]).toEqual(['/']);
        })
    });
    
});
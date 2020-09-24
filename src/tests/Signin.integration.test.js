import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import Signin from '../container/Auth/SignIn/Signin';
import { storeFactory, findByTestAttr, findByIdSelector, addDays } from '../testUtils';


/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    return shallow(<Signin store={store} {...props} />).dive().dive();
};

const sampleResponse = {
    expiresOn: Math.round(addDays(new Date(), 1).getTime() / 1000),
    userId: '123'
}

describe('User authenticates', () => {
    let wrapper;
    beforeEach(() => {
        moxios.install();
        wrapper = setup({});
        wrapper.setState({ username: 'user', password: 'pass' });
        const component = findByTestAttr(wrapper, 'component-loginform').dive();
        const loginBtn = findByIdSelector(component, 'loginBtn');
        loginBtn.simulate('click', { preventDefault: () => { } });
    })

    afterEach(() => {
        moxios.uninstall();
    })

    it('should update the auth reducer state with the login credentials without errors', (done) => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: sampleResponse
            }).then(() => {
                const authReceivedState = wrapper.instance().props.store.getState().auth;
                const expectedState = {
                    userId: sampleResponse.userId,
                    expiresOn: new Date(sampleResponse.expiresOn * 1000),
                    authCheckComplete: true,
                    error: null,
                    logging: false,
                }
                expect(authReceivedState).toEqual(expectedState);
                done();
            })
        })

    });

    it('should raise an error on invalid credentials', (done) => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 401,
                response: { message: 'Invalid credentials' }
            }).then(() => {
                const expectedState = {
                    userId: null,
                    expiresOn: null,
                    logging: false,
                    authCheckComplete: true,
                    error: 'Invalid credentials'
                }
                expect(wrapper.instance().props.store.getState().auth).toEqual(expectedState)
                done();
            })
        });
    })
});
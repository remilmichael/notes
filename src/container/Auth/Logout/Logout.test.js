import React from 'react';
import { shallow } from 'enzyme';

import Logout, { Logout as UnconnectedLogout } from './Logout';
import { storeFactory } from '../../../testUtils';


/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}, props={}) => {
    const store = storeFactory(initialState);
    return shallow(<Logout store={store} { ...props } />).dive();
}

describe('Logout component', () => {

    it('`onLogout action creator is a function on the props`', () => {
        const wrapper = setup();
        const onLogoutProp = wrapper.instance().props.onLogout;
        expect(onLogoutProp).toBeInstanceOf(Function);
    })

    it('should call the `onLogout()` function received as prop', () => {
        const onLogoutMock = jest.fn();
        const props = { onLogout: onLogoutMock };
        const wrapper = shallow(<UnconnectedLogout { ...props } />, { disableLifecycleMethods: true });
        wrapper.instance().componentDidMount();
        const onLogoutCallCount = onLogoutMock.mock.calls.length;
        expect(onLogoutCallCount).toBe(1);
    });
});


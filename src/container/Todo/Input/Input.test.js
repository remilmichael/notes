import React from 'react';
import { shallow } from 'enzyme';

import Input from './Input';
import { findByTestAttr } from '../../../testUtils';

/**
 * Setup function for app component.
 * @returns {ShallowWrapper}
 */
const setup = (props) => {
    return shallow(<Input { ...props } />);
}

describe('Testing `Input`', () => {
    
    it('should invoke function when the button is clicked', () => {
        const mockClicked = jest.fn();
        const wrapper = setup({ clicked: mockClicked });
        const submitButton = findByTestAttr(wrapper, 'add-button');
        submitButton.simulate('click');
        expect(mockClicked.mock.calls.length).toBe(1)
    });

    it('should invoke function during `onKeyDown` event on input field', () => {
        const mockKeyPressed = jest.fn();
        const wrapper = setup({ keyPressed: mockKeyPressed });
        const inputField = findByTestAttr(wrapper, 'input-box');
        inputField.simulate('KeyDown');
        expect(mockKeyPressed.mock.calls.length).toBe(1);
    });
});
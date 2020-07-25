import React from 'react';
import { shallow } from 'enzyme';
import NoteInput from './Input.js';
import { findByTestAttr, checkProps } from '../../../testUtils.js';

const defaultProps = { heading: 'Test heading', body: 'Test note' };

/**
 * Factory function to generate a ShallowWrapper for the `Input` component
 * @function setup
 * @param {Object} props - Props given to the component
 * @returns {ShallowWrapper}
 */
const setup = (props={}) => {
    const setupProps = { ...defaultProps, ...props };
    return shallow(<NoteInput { ...setupProps } />);
}


test('should render <input /> component for heading without errors', () => {
    const wrapper = setup();
    const headingInputComponent = findByTestAttr(wrapper, 'component-input-heading');
    expect(headingInputComponent.length).toBe(1);
});

test('should render <input /> component for notes without errors', () => {
    const wrapper = setup();
    const noteInputComponent = findByTestAttr(wrapper, 'component-input-notes');
    expect(noteInputComponent.length).toBe(1);
});

test('does not throw warning on expected props', () => {
    checkProps(NoteInput, defaultProps);
});
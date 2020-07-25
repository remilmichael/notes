import React from 'react';
import { shallow } from 'enzyme';
import Action from './Action';
import { findByTestAttr } from '../../../testUtils';

/**
 * Factory function to generate a ShallowWrapper for the `Input` component
 * @function setup
 * @param {Object} props - Props given to the component
 * @returns {ShallowWrapper}
 */
const setup = (props={}) => {
    return shallow(<Action { ...props } />);
};

test('<Action /> should render without errors', () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, 'component-button');
    expect(button.length).toBe(3);
});
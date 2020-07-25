import checkPropTypes from 'check-prop-types';


/**
 * Return node(s) with specified `data-test` attribute
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {String} val - Value of the data-test attribute
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`);
}

/**
 * Function to check the `prop types` of the component given
 * @param {JSX} component 
 * @param {Object} props 
 */
export const checkProps = (component, props) => {
    const propError = checkPropTypes(component.propTypes, props, 'prop', component.name);
    expect(propError).toBeUndefined();
}
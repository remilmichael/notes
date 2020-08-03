import checkPropTypes from 'check-prop-types';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';


import noteReducer from './store/reducers/notes/notes';
import authReducer from './store/reducers/auth/auth';
import msgReducer from './store/reducers/message/message';
import notesList from './store/reducers/allNotes/allNotes';

const rootReducer = combineReducers({
  note: noteReducer,
  auth: authReducer,
  message: msgReducer,
  notelist: notesList
});

/**
 * Return node(s) with specified `data-test` attribute
 * 
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {String} val - Value of the data-test attribute
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`);
}

/**
 * Return node(s) with specified `CSS id` selector
 * 
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {String} val - Value of the CSS id selector
 * @returns {ShallowWrapper}
 */
export const findByIdSelector = (wrapper, val) => {
    return wrapper.find(`#${val}`);
}


/**
 * Function to check the `prop types` of the component given
 * 
 * @param {JSX} component 
 * @param {Object} props 
 */
export const checkProps = (component, props) => {
    const propError = checkPropTypes(component.propTypes, props, 'prop', component.name);
    expect(propError).toBeUndefined();
}

/**
 * Create a testing store with imported reducers, middleware and initialState state.
 * 
 * @param {object} initialState - Initial state for store
 * @function storeFactory
 * @returns {Store} - Redux store.
 */
export const storeFactory = (initialState) => {
    // return createStore(rootReducer, initialState, applyMiddleware(thunk));
    // createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
    const storeWithMiddleware = applyMiddleware(thunk)(createStore);
    return storeWithMiddleware(rootReducer, initialState);
}

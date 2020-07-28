import * as actionTypes from '../../actions/actionTypes';
import { reducer } from './message';

const initialState = {
    message: null,
    type: null // bootstrap alert types
}

describe('`message` reducer', () => {
    describe('action type `SET_GLOBAL_MESSAGE`', () => {
        test('should return the state when a new message is create', () => {
            const message = 'Test message';
            const msgType = 'warning';
            const newState = reducer(initialState, { type: actionTypes.SET_GLOBAL_MESSAGE, message: message, msgType: msgType });
            expect(newState).toEqual({ ...initialState, message: message, type: msgType });
        });

        test('should return the state when message is cleared', () => {
            const newState = reducer(initialState, { type: actionTypes.UNSET_GLOBAL_MESSAGE });
            expect(newState).toEqual({ ...initialState });
        });
    });
});
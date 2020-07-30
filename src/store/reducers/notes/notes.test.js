import { reducer } from './notes';
import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    loadingNow: false,
    error: null,
    saveSuccessful: false,
};


describe('`notes` reducer', () => {
    
    describe('action type `RESET_NOTE_STATE_DEFAULT`', () => {
        test('should return the initial state', () => {
            const updatedState = {
                loadingNow: true,
                error: 'sample error',
                saveSuccessful: false,
            };
            const newState = reducer(updatedState, { type: actionTypes.RESET_NOTE_STATE_DEFAULT });
            expect(newState).toEqual(initialState);
        });
    });

});
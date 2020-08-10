import * as actionTypes from '../actionTypes';
import * as actions from './message';

describe('message actions', () => {
    
    const message = "Sample message";
    const msgType = "warning";

    it('should return action `SET_GLOBAL_MESSAGE`', () => {
        const expectedActions = {
                type: actionTypes.SET_GLOBAL_MESSAGE,
                message: message,
                msgType: msgType
        };
        expect(actions.setMessage(message, msgType)).toEqual(expectedActions);
    });

    it('should return action `UNSET_GLOBAL_MESSAGE`', () => {
        const expectedActions = {
            type: actionTypes.UNSET_GLOBAL_MESSAGE
        };
        expect(actions.unsetMessage()).toEqual(expectedActions)
    });

});
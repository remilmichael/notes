import moxios from 'moxios';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actionTypes from '../actionTypes';
import * as actions from './auth';
import {
    addDays,
    mockLocalStorage,
    tamperedKey,
    goodKey,
    validDecryptedKey
} from '../../../testUtils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('auth actions', () => {
    const expiresOn = addDays(new Date(), 1);
    const userId = 'abcd';

    it('should create an action to start spinner while user authenticates', () => {
        const expectAction = {
            type: actionTypes.AUTH_USER_START
        }
        expect(actions.authStart()).toEqual(expectAction);
    });

    it('should create an action to stop spinner and set authentication to success', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem');
        const receivedAction = actions.authSuccess(expiresOn, userId);
        const expectedAction = {
            type: actionTypes.AUTH_USER_SUCCESS,
            payload: { expiresOn, userId }
        };
        expect(spy.mock.calls.length).toBe(3);
        expect(receivedAction).toEqual(expectedAction);
    });

    it('should clear credentials from `localStorage`', () => {
        const spy = jest.spyOn(Storage.prototype, 'removeItem');
        const receivedAction = actions.logout();
        const expectedAction = {
            type: actionTypes.AUTH_USER_LOGOUT
        };
        expect(spy.mock.calls.length).toBe(2);
        expect(receivedAction).toEqual(expectedAction);
    });

    it('should stop spinner since authentication was failed and set error message', () => {
        const error = "Something went wrong"
        const expectedAction = {
            type: actionTypes.AUTH_USER_FAILED,
            payload: error
        }
        expect(actions.authFailed(error)).toEqual(expectedAction);
    });

    it('should clear the previous error', () => {
        const expectAction = {
            type: actionTypes.AUTH_ERROR_RESET
        }
        expect(actions.clearError()).toEqual(expectAction);
    });

    describe('Testing `authUser` async action creator', () => {
        let store;
        beforeEach(() => {
            store = mockStore({});
            moxios.install();
        })

        afterEach(() => {
            moxios.uninstall();
            store.clearActions();
        })

        it('should return actions { AUTH_USER_START, AUTH_USER_SUCCESS } ', (done) => {
            const username = 'user123';
            const password = 'password';
            const decryptedKey = validDecryptedKey;
            const response = {
                expiresOn: addDays(new Date(), 1) / 1000,
                userId: username,
                secretKey: goodKey
            }
            const expectedActions = [
                actions.authStart(),
                actions.authSuccess(new Date(response.expiresOn * 1000), response.userId, decryptedKey)
            ];
            const store = mockStore({});
            store.dispatch(actions.authUser({ username: username, password: password }));
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: response
                })
            })

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                })
            })
        });

        it('should return action { AUTH_USER_START, AUTH_USER_FAILED } - tampered keys', (done) => {
            const username = 'user123';
            const password = 'password';
            const response = {
                expiresOn: addDays(new Date(), 1) / 1000,
                userId: username,
                secretKey: tamperedKey
            }
            const expectedActions = [
                actions.authStart(),
                actions.authFailed('WARNING: Secret tampered!')
            ];
            const store = mockStore({});
            store.dispatch(actions.authUser({ username: username, password: password }));
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: response
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                })
            })

        })

        it('should return actions { AUTH_USER_START, AUTH_USER_FAILED } ', (done) => {

            const error = "Login failed";
            const expectedActions = [
                { type: actionTypes.AUTH_USER_START },
                { type: actionTypes.AUTH_USER_FAILED, payload: error }
            ];

            store.dispatch(actions.authUser({ username: 'user', password: 'password' }));

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 401,
                    response: { message: error }
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                })
            })
        });

    });
});


describe('Testing `tryAutoLogin` action creator', () => {
    const token = 'abcd';
    const userId = '1234';
    const expiresOn_valid = addDays(new Date(), 1);
    const expiresOn_invalid = new Date();

    let store;
    beforeEach(() => {
        store = mockStore({});
    })
    afterEach(() => {
        store.clearActions();
    })


    it('should check on `localStorage` if credentials exists', () => {
        const spy = jest.spyOn(Storage.prototype, 'getItem');
        store.dispatch(actions.tryAutoLogin());
        expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should return action `AUTH_USER_SUCCESS`', () => {
        const expectedActions = [
            {
                type: actionTypes.AUTH_USER_SUCCESS,
                payload: {
                    expiresOn: expiresOn_valid,
                    userId: userId
                }
            }
        ];
        mockLocalStorage(token, expiresOn_valid, userId);
        store.dispatch(actions.tryAutoLogin());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should return action `AUTH_USER_LOGOUT` - NO token in `localStorage`', () => {
        const expectedActions = [
            { type: actionTypes.AUTH_USER_LOGOUT }
        ];

        mockLocalStorage(token, null, userId);
        store.dispatch(actions.tryAutoLogin());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should return action `AUTH_USER_LOGOUT` - Expired token ', () => {
        const expectedActions = [
            { type: actionTypes.AUTH_USER_LOGOUT }
        ];
        mockLocalStorage(token, expiresOn_invalid, userId);
        store.dispatch(actions.tryAutoLogin());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should return action `AUTH_USER_LOGOUT` when no JWT token found in `localStorage`', () => {
        const expectedActions = [
            { type: actionTypes.AUTH_USER_LOGOUT }
        ];
        mockLocalStorage(undefined, undefined, undefined);
        store.dispatch(actions.tryAutoLogin());
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should return action `AUTH_USER_LOGOUT` when no `user id` found in `localStorage`', () => {
        const expectedActions = [
            { type: actionTypes.AUTH_USER_LOGOUT }
        ];
        mockLocalStorage(token, expiresOn_valid, undefined);
        store.dispatch(actions.tryAutoLogin());
        expect(store.getActions()).toEqual(expectedActions);
    });
});
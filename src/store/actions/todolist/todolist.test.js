import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { validDecryptedKey } from '../../../testUtils';
import Axios from '../../../axios-notes';
import * as actionTypes from '../actionTypes';
import * as actions from './todolist';

const mockStore = configureMockStore([thunk]);

const titlesEncrypted = [
    { todoId: '123', todoTitle: 'U2FsdGVkX18iPTBkwyx5KGC15QI8Iby035qFP3WOeyk=' },
    { todoId: '456', todoTitle: 'U2FsdGVkX19rP0R+xtgpYgwqB7kzKxvipp4vfNLeLOA=' },
    { todoId: '789', todoTitle: 'U2FsdGVkX1/xybot56EHdHjF6YrSb1a2bsncJDWDoO4=' },
];

const titles = [
    { todoId: '123', todoTitle: 'Title 1' },
    { todoId: '456', todoTitle: 'Title 2' },
    { todoId: '789', todoTitle: 'Title 3' },
];

it('should return action type `FETCH_TODOS_TITLES_FAILED`', () => {
    const receivedState = actions.fetchTitlesFailed();
    const expectedState = {
        type: actionTypes.FETCH_TODOS_TITLES_FAILED
    };
    expect(receivedState).toEqual(expectedState);
});

it('should return action type `FETCH_MORE_TODOS_START`', () => {
    const receivedState = actions.fetchMoreTitleStart();
    const expectedState = {
        type: actionTypes.FETCH_MORE_TODOS_START
    };
    expect(receivedState).toEqual(expectedState);
});

it('should return action type `FETCH_TODOS_TITLES_SUCCESS`', () => {
    const receivedState = actions.fetchTitlesSuccess(titles);
    const expectedState = {
        type: actionTypes.FETCH_TODOS_TITLES_SUCCESS,
        payload: titles
    };
    expect(receivedState).toEqual(expectedState);
});

describe('Testing `fetchAllTodos` action creator', () => {
    const secretKey = validDecryptedKey
    const recordNumber = 15;
    let store;
    beforeEach(() => {
        store = mockStore({});
        moxios.install(Axios);
    })
    afterEach(() => {
        store.clearActions();
        moxios.uninstall(Axios);
    })
    it('should return action types { FETCH_MORE_TODOS_START, FETCH_TODOS_TITLES_SUCCESS }', (done) => {
        store.dispatch(actions.fetchAllTodos(recordNumber, secretKey));
        const expectedActions = [
            { type: actionTypes.FETCH_MORE_TODOS_START },
            {
                type: actionTypes.FETCH_TODOS_TITLES_SUCCESS,
                payload: titles
            }
        ];
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: titlesEncrypted
            }).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            })
        })
    });

    it('should return action types { FETCH_MORE_TODOS_START, FETCH_TODOS_TITLES_FAILED }', (done) => {
        store.dispatch(actions.fetchAllTodos(recordNumber, validDecryptedKey));
        const expectedActions = [
            { type: actionTypes.FETCH_MORE_TODOS_START },
            { type: actionTypes.FETCH_TODOS_TITLES_FAILED }
        ];
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 401
            }).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            })
        })
    });
});
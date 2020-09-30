import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { validDecryptedKey } from '../../../testUtils';
import Axios from '../../../axios-notes';
import * as actionTypes from '../actionTypes';
import * as actions from './notelist';

const mockStore = configureMockStore([thunk]);

describe('notelist actions', () => {
    const secretKey = validDecryptedKey;
    const recordNumber = 11
    const titlesEncrypted = [
        { noteId: '123', noteHeading: 'U2FsdGVkX19rBG7y2ZXppRoqDOM6t7xw9ZCiBM5DoaI=' },
        { noteId: '456', noteHeading: 'U2FsdGVkX1/pIo9EtCQTa+09Myhn4hcUazTkLV0rgF8=' },
        { noteId: '789', noteHeading: 'U2FsdGVkX197+lmUaY6stE/ehO4r0A0BvEU1TlMDMaU=' }
    ];

    const titles = [
        { noteId: '123', noteHeading: 'Heading 1' },
        { noteId: '456', noteHeading: 'Heading 2' },
        { noteId: '789', noteHeading: 'Heading 3' }
    ];

    it('should return action type `FETCH_NOTES_TITLES_FAILED`', () => {
        const expectedAction = { type: actionTypes.FETCH_NOTES_TITLES_FAILED };
        expect(actions.fetchTitlesFailed()).toEqual(expectedAction);
    });

    it('should return action type `FETCH_MORE_NOTES_START`', () => {
        const expectedAction = { type: actionTypes.FETCH_MORE_NOTES_START };
        expect(actions.fetchMoreTitleStart()).toEqual(expectedAction);
    });

    it('should return action type `SAVE_NOTES_LIST`', () => {
        const expectedAction = {
            type: actionTypes.SAVE_NOTES_LIST,
            payload: titles
        };
        expect(actions.fetchTitlesSuccess(titles)).toEqual(expectedAction);
    });

    it('should return action type `CLEAR_NOTE_REDUX`', () => {
        const expectedAction = {
            type: actionTypes.CLEAR_NOTE_REDUX,
        };
        expect(actions.clearTitles()).toEqual(expectedAction);
    });

    describe('Testing `fetchAllNotes` action creator', () => {
        let store;
        beforeEach(() => {
            store = mockStore({});
            moxios.install(Axios);
        })
        afterEach(() => {
            moxios.uninstall(Axios);
            store.clearActions();
        })

        it('should return action types { FETCH_MORE_NOTES_START, SAVE_NOTES_LIST }', (done) => {
            store.dispatch(actions.fetchAllNotes(recordNumber, secretKey));

            const expectedActions = [
                { type: actionTypes.FETCH_MORE_NOTES_START },
                { type: actionTypes.SAVE_NOTES_LIST, payload: titles }
            ];
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: titlesEncrypted
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done()
                })
            })
        });

        it('should return action types { FETCH_MORE_NOTES_START, FETCH_NOTES_TITLES_FAILED } ', (done) => {
            store.dispatch(actions.fetchAllNotes(recordNumber, secretKey));

            const expectedActions = [
                { type: actionTypes.FETCH_MORE_NOTES_START },
                { type: actionTypes.FETCH_NOTES_TITLES_FAILED }
            ];
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 401,
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                })
            })
        });
    });
});
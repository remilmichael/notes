import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Axios from '../../../axios-notes';
import * as actionTypes from '../actionTypes';
import * as actions from './notes';
import { defaultErrorMessage } from './notes';

const mockStore = configureMockStore([thunk]);

describe('Testing `notes` action creators', () => {
   
    const idToken = 'token123';
    const error = "Failed. Check connection";
    const note = {
        noteId: 'abcd',
        noteHeading: 'Sample heading',
        noteBody: 'Sample note',
        lastUpdated: new Date(),
        userId: '1234'
    };
   
    it('should return action type `DB_ACTION_START`', () => {
        const expectedAction = { type: actionTypes.DB_ACTION_START };
        expect(actions.dbActionStart()).toEqual(expectedAction);
    });

    it('should return action type `DB_ACTION_SUCCESS`', () => {
        const expectedAction = { type: actionTypes.DB_ACTION_SUCCESS };
        expect(actions.dbActionSuccess()).toEqual(expectedAction);
    });

    it('should return action type `DB_ACTION_FAILED`', () => {
        const expectedAction = { type: actionTypes.DB_ACTION_FAILED, error: error };
        expect(actions.dbActionFailed(error)).toEqual(expectedAction);
    });
    
    it('should return action type `SAVE_NOTE_REDUX` with payload - note', () => {
        const expectedAction = { type: actionTypes.SAVE_NOTE_REDUX, payload: note };
        expect(actions.saveNoteRedux(note)).toEqual(expectedAction);
    });

    it('should return action type `UPDATE_NOTE_REDUX` with payload - updated note', () => {
        const expectedAction = { type: actionTypes.UPDATE_NOTE_REDUX, payload: note };
        expect(actions.updateNoteInRedux(note)).toEqual(expectedAction);
    });

    it('should return action type `DELETE_NOTE_REDUX` with payload - note id', () => {
        const expectedAction = { type: actionTypes.DELETE_NOTE_REDUX, payload: note.noteId};
        expect(actions.deleteNoteFromRedux(note.noteId)).toEqual(expectedAction);
    });

    it('should return action type `RESET_NOTE_STATE_DEFAULT`', () => {
        const expectedAction = { type: actionTypes.RESET_NOTE_STATE_DEFAULT};
        expect(actions.resetToDefault()).toEqual(expectedAction);
    });

    describe('Testing async action creator `updateNote`', () => {
        let store;
        beforeEach(() => {
            moxios.install(Axios);
            store = mockStore({});
        });

        afterEach(() => {
            moxios.uninstall(Axios);
            store.clearActions();
        });

        it('should dispatch actions { DB_ACTION_START, UPDATE_NOTE_REDUX, DB_ACTION_SUCCESS }', (done) => {
            store.dispatch(actions.updateNote(note, idToken));

            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.UPDATE_NOTE_REDUX, payload: note },
                { type: actionTypes.DB_ACTION_SUCCESS }
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - with error message from server', (done) => {
            store.dispatch(actions.updateNote(note, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: error}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    response: { message: error }
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - without error message from server ', (done) => {
            store.dispatch(actions.updateNote(note, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: defaultErrorMessage}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });
    });

    describe('Testing async action creator `saveNote`', () => {
        let store;
        beforeEach(() => {
            store = mockStore({});
            moxios.install(Axios);
        });

        afterEach(() => {
            store.clearActions();
            moxios.uninstall(Axios);
        });

        it('should dispatch actions { DB_ACTION_START, SAVE_NOTE_REDUX, DB_ACTION_SUCCESS }', (done) => {
            store.dispatch(actions.saveNote(note, idToken));

            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.SAVE_NOTE_REDUX, payload: note },
                { type: actionTypes.DB_ACTION_SUCCESS }
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - with error message from server', (done) => {
            store.dispatch(actions.saveNote(note, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: error}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    response: { message: error }
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - without error message from server ', (done) => {
            store.dispatch(actions.saveNote(note, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: defaultErrorMessage}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });
    });

    describe('Testing async action creator `deleteNote`', () => {
        let store;
        beforeEach(() => {
            store = mockStore({});
            moxios.install(Axios);
        });

        afterEach(() => {
            store.clearActions();
            moxios.uninstall(Axios);
        });

        it('should dispatch actions { DB_ACTION_START, DELETE_NOTE_REDUX, DB_ACTION_SUCCESS }', (done) => {
            store.dispatch(actions.deleteNote(note.noteId, idToken));

            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DELETE_NOTE_REDUX, payload: note.noteId },
                { type: actionTypes.DB_ACTION_SUCCESS }
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - with error message from server', (done) => {
            store.dispatch(actions.deleteNote(note.noteId, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: error}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    response: { message: error }
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });

        it('should dispatch actions { DB_ACTION_START, DB_ACTION_FAILED } - without error message from server ', (done) => {
            store.dispatch(actions.deleteNote(note, idToken));
            const expectedAction = [
                { type: actionTypes.DB_ACTION_START },
                { type: actionTypes.DB_ACTION_FAILED, error: defaultErrorMessage}
            ];

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400,
                }).then(() => {
                    expect(store.getActions()).toEqual(expectedAction);
                    done();
                })
            })
        });
    });
    
});
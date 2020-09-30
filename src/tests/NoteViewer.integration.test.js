import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import Axios from '../axios-notes';
import NoteViewer from '../container/NoteViewer/NoteViewer';
import {
    storeFactory,
    authInitialState,
    sampleNotes,
    findByTestAttr,
    findByIdSelector,
    validDecryptedKey
} from '../testUtils';
import { initialState as notelistInitialState } from '../store/reducers/notelist/notelist';

/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    return shallow(<NoteViewer store={store} {...props} />).dive().dive();
};


describe('Accessing `NoteViewer` after logged-in', () => {

    const authWithCredentials = {
        ...authInitialState,
        secretKey: validDecryptedKey,
        userId: 'id123',
        expiresOn: new Date()
    }

    beforeEach(() => {
        moxios.install(Axios);
    });

    afterEach(() => {
        moxios.uninstall(Axios);
    })

    it('should update the `auth` reducer when the fetch failed', (done) => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({}).then(() => {
                const fetchFailed = wrapper.instance().props.store.getState().notelist.fetchFailed;
                expect(fetchFailed).toBeTruthy();
                done()
            })
        });
        const wrapper = setup({ auth: authWithCredentials });
    });

    it('should update the `auth` reducer to load `Spinner` when `MainPage` mounts', () => {
        const wrapper = setup({ auth: authWithCredentials });
        const isLoading = wrapper.instance().props.store.getState().notelist.loading;
        expect(isLoading).toBe(true);
    });

    it('should fetch more note titles from server when `load more` is clicked', (done) => {
        const updatedNotelistState = {
            ...notelistInitialState,
            notes: sampleNotes,
            hasMoreNotes: true,
            nextRecordNumber: sampleNotes.length
        };

        const moreNotesEncrypted = [
            { noteId: 'abcd', noteHeading: 'U2FsdGVkX18cA7mihsGChmvGEWVbkzVjyJxf4+HONfE=' },
            { noteId: '131', noteHeading: 'U2FsdGVkX19NQkdyUcLAoikEUD6Pc5fxdsyeQ5hogWU=' },
            { noteId: '454', noteHeading: 'U2FsdGVkX19xZvKrX6zyvhxM8WtKA5eSysEdmReJO5E=' },
        ];

        const moreNotes = [
            { noteId: 'abcd', noteHeading: 'Heading 5' },
            { noteId: '131', noteHeading: 'Heading 6' },
            { noteId: '454', noteHeading: 'Heading 7' },
        ];

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: moreNotesEncrypted
            }).then(() => {
                const receivedState = wrapper.instance().props.store.getState().notelist;
                const expectedState = {
                    ...notelistInitialState,
                    hasMoreNotes: false, // Since no. of new records is less than PAGE_SIZE
                    notes: [...sampleNotes, ...moreNotes],
                    nextRecordNumber: sampleNotes.length + moreNotes.length
                }
                expect(receivedState).toEqual(expectedState);
                done();
            })
        })

        const wrapper = setup({ auth: authWithCredentials, notelist: updatedNotelistState });
        const spinnerComponent = findByTestAttr(wrapper, 'component-loadmore').dive();
        const loadMoreBtn = findByIdSelector(spinnerComponent, 'loadMoreBtn');
        loadMoreBtn.simulate('click');
    })
});
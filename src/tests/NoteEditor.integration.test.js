import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';
import CryptoJS from 'crypto-js'

import AxiosInstance from '../axios-notes';
import NoteEditor from '../container/NoteEditor/NoteEditor';
import { storeFactory, findByTestAttr, findByIdSelector, validDecryptedKey } from '../testUtils';
import { initialState as authInitialState } from '../store/reducers/auth/auth';
import { initialState as allNotesInitialState } from '../store/reducers/notelist/notelist';


/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    return shallow(<NoteEditor store={store} {...props} />).dive().dive();
}


describe('Saving note', () => {

    let wrapper;

    const updatedAuth = {
        ...authInitialState,
        secretKey: validDecryptedKey,
        userId: 'id123',
        expiresOn: new Date(),
    };

    const sampleNote = {
        // noteId is generated automatically
        heading: 'Sample note heading',
        note: 'Sample note body',
    };

    const encryptedHeading = 'U2FsdGVkX1/GIkmverfkVeFF+D/8ehF0TKmK66M9ppnvQg7JaEi6uX1JMKWx2tc5';
    const encryptedBody = 'U2FsdGVkX1+nBm/CtgR7t2GgRWtg5SnL7+0LRLVNCjnXuieIi2Ss+8ve7/pJbQ8l';

    beforeEach(() => {
        moxios.install(AxiosInstance);

    });

    afterEach(() => {
        moxios.uninstall(AxiosInstance);
    });

    it('should encrypt the note before sending it to the server', (done) => {

        CryptoJS.AES.encrypt = jest.fn().mockImplementationOnce((data, key) => {
            return encryptedHeading;
        }).mockImplementationOnce((data, key) => {
            return encryptedBody;
        })
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200
            }).then(() => {
                const receivedData = JSON.parse(request.config.data);
                const expectedData = {
                    noteId: receivedData.noteId,
                    noteHeading: encryptedHeading,
                    noteBody: encryptedBody,
                    userId: updatedAuth.userId,
                    lastUpdated: receivedData.lastUpdated
                };
                expect(receivedData).toEqual(expectedData);
                done();
                jest.clearAllMocks();
            })
        })
        wrapper = setup({ auth: updatedAuth });
        wrapper.setState(sampleNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
    });

    it('should add the newly created note in the `notelist` reducer', (done) => {
        CryptoJS.AES.encrypt = jest.fn().mockImplementationOnce((data, key) => {
            return encryptedHeading;
        }).mockImplementationOnce((data, key) => {
            return encryptedBody;
        })
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200
            }).then(() => {
                const receivedData = JSON.parse(request.config.data);
                const recievedNote = wrapper.instance().props.store.getState().notelist.notes[0];
                const expectedNote = {
                    noteId: receivedData.noteId,
                    noteHeading: sampleNote.heading
                }
                expect(recievedNote).toEqual(expectedNote)
                done();
                jest.clearAllMocks();
            })
        })
        wrapper = setup({ auth: updatedAuth });
        wrapper.setState(sampleNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
    });

    it('should update the note in redux and position it first on array', (done) => {
        CryptoJS.AES.encrypt = jest.fn().mockImplementationOnce((data, key) => {
            return encryptedHeading;
        }).mockImplementationOnce((data, key) => {
            return encryptedBody;
        })
        const sampleNotes = [
            { noteId: '123', noteHeading: 'Heading 1' },
            { noteId: '456', noteHeading: 'Heading 2' },
            { noteId: '789', noteHeading: 'Heading 2' },
            { noteId: '467', noteHeading: 'Heading 4' },
            { noteId: 'abcd', noteHeading: 'Heading 5' },
        ];
        const newNote = {
            ...sampleNote,
            noteId: 'abcd'
        }
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200
            }).then(() => {
                expect(wrapper.instance().props.store.getState().notelist.notes[0]).toEqual({ ...sampleNotes[4], noteHeading: sampleNote.heading });
                done();
            })
        })
        wrapper = setup({ auth: updatedAuth, notelist: { ...allNotesInitialState, notes: [...sampleNotes] } });
        wrapper.setState(newNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
    });

});
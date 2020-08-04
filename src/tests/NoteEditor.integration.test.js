import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import AxiosInstance from '../axios-notes';
import NoteEditor from '../container/NoteEditor/NoteEditor';
import { storeFactory, authInitialState, findByTestAttr, findByIdSelector } from '../testUtils';
import { reducer, initialState as allNotesInitialState } from '../store/reducers/allNotes/allNotes';


/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}, props={}) => {
    const store = storeFactory(initialState);
    return shallow(<NoteEditor store={store} { ...props } />).dive().dive();
}


describe('Saving note', () => {
    
    let wrapper;

    const updatedAuth = {
        ...authInitialState,
        idToken: 'sampleToken123',
        userId: 'id123',
        expiresOn: new Date(),
    };

    const sampleNote = {
        // noteId is generated automatically
        heading: 'Sample note heading',
        note: 'Sample note body',
    };

    beforeEach(() => {
        moxios.install(AxiosInstance);
        
    });

    afterEach(() => {
        moxios.uninstall(AxiosInstance);
    });

    it('should receive the request sent from redux thunk', (done) => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200
            }).then(() => {
                const receivedData = JSON.parse(request.config.data);
                const expectedData = {
                    noteId: receivedData.noteId,
                    noteHeading: sampleNote.heading,
                    noteBody: sampleNote.note,
                    userId: updatedAuth.userId,
                    lastUpdated: receivedData.lastUpdated
                };
                expect(receivedData).toEqual(expectedData);
                done();
            })
        })
        wrapper = setup({ auth: updatedAuth });
        wrapper.setState(sampleNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
    });

    it('should add the newly created note in the `allNotes` reducer', (done) => {
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
            })
        })
        wrapper = setup({ auth: updatedAuth });
        wrapper.setState(sampleNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
    });

    it('should update ', (done) => {
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
                console.log(wrapper.instance().props.store.getState().notelist);
                done();
            })
        })
        wrapper = setup({ auth: updatedAuth, notelist: {...allNotesInitialState, notes: [...sampleNotes]} });
        wrapper.setState(newNote);
        const saveBtn = findByIdSelector(findByTestAttr(wrapper, 'component-action').dive(), 'saveBtn');
        saveBtn.simulate('click');
        console.log(wrapper.instance().props.store.getState().notelist);
    });

});
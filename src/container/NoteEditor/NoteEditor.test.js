import React from 'react';
import { shallow } from 'enzyme';

import { storeFactory, findByTestAttr } from '../../testUtils';
import NoteEditor from './NoteEditor';
import moxios from 'moxios';

/**
 * Initial state of `auth` reducer
 */
const authInitialState = {
    userId: null,
    logging: false,
    idToken: null,
    expiresOn: null,
    authCheckComplete: false,
    error: null
}

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


describe('Accessing `NoteEditor` without signing in', () => {

    describe('`NoteEditor` while creating new note', () => {

        let wrapper;
        beforeEach(() => {
            wrapper = setup();
        })
        
        it('should NOT render any form components', () => {
            const component = findByTestAttr(wrapper, 'component-inputform');
            expect(component.length).toBe(0);
        });
        it('should render `Redirect` component with NO `noteId` as url parameter', () => {
            const component = findByTestAttr(wrapper, 'component-redirect-plain');
            expect(component.length).toBe(1);
        })
    });

    describe('`NoteEditor` while accessing existing note', () => {
        const randomNoteId = 'randomId757';
        let wrapper;
        beforeEach(() => {
            wrapper = setup({}, { location: { search: { id: randomNoteId }} });
        });

        it('should render `Redirect` component with `noteId` as url parameter', () => {
            const component = findByTestAttr(wrapper, 'component-redirect-param');
            expect(component.length).toBe(1);
        });
        it('should NOT render any form components ', () => {
            const component = findByTestAttr(wrapper, 'component-redirect-param');
            expect(component.length).toBe(1);
        });
    });

});


describe('Accessing `NoteEditor` with valid login credentials', () => {
    
    const authUpdatedState = {
        ...authInitialState,
        idToken: 'sampleToken123',
        userId: 'id123',
        expiresOn: new Date()
    }

    describe('`NoteEditor` with NO url params', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = setup({ auth: authUpdatedState });
        })

        it('should render `input form`', () => {
            const component = findByTestAttr(wrapper, 'component-inputform');
            expect(component.length).toBe(1);
        });

        it('should render the `action` (buttons) components with `disabled` delete button ', () => {
            const actionComponent = findByTestAttr(wrapper, 'component-action');
            expect(actionComponent.length).toBe(1);
            const deleteBtn = actionComponent.dive().find('#deleteBtn');
            expect(deleteBtn.length).toBe(1);
            expect(deleteBtn.prop('disabled')).toBe(true);
        });
    });


    describe('`NoteEditor` with url params', () => {
        const randomNoteId = 'randomId757';
        const sampleResponse = {
            noteId: randomNoteId,
            noteHeading: 'This is a sample note heading',
            noteBody: 'I\'m the note body',
            lastUpdated: new Date(),
        };

        beforeEach(() => {
            moxios.install();
        });

        afterEach(() => {
            moxios.uninstall();
        })
        
        it('should set the state with fetched (mocked) data from server', (done) => {

            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: sampleResponse
                }).then(() => {
                    const updatedState =  wrapper.instance().state;
                    expect(updatedState.noteId).toEqual(sampleResponse.noteId);
                    expect(updatedState.heading).toEqual(sampleResponse.noteHeading);
                    expect(updatedState.lastUpdated).toEqual(sampleResponse.lastUpdated);
                    expect(updatedState.fetchingNow).toEqual(false);

                    const spinner = findByTestAttr(wrapper, 'component-spinner');
                    expect(spinner.length).toBe(0);
                    done();
                })
            })

            const wrapper = setup({ auth: authUpdatedState }, { location: { search: { id: randomNoteId }}});
            const spinner = findByTestAttr(wrapper, 'component-spinner');
            expect(spinner.length).toBe(1);
        });
        
    });



});
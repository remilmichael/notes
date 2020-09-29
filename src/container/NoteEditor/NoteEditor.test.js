import React from 'react';
import { shallow } from 'enzyme';

import { storeFactory, findByTestAttr, findByIdSelector, validDecryptedKey } from '../../testUtils';
import { initialState as authInitialState } from '../../store/reducers/auth/auth';
import NoteEditor from './NoteEditor';
import moxios from 'moxios';

const randomNoteId = 'randomId757';

/**
 * A sample server response while fetching a note
 */
const sampleResponse = {
    noteId: randomNoteId,
    noteHeading: 'U2FsdGVkX18P7ezuTeD+R9BMucJTxur+R5YE5SEhgti+LohNv/SYEsQPZklVkc6r',
    noteBody: 'U2FsdGVkX1/GIkmverfkVeFF+D/8ehF0TKmK66M9ppnvQg7JaEi6uX1JMKWx2tc5',
    lastUpdated: new Date(),
};

const sampleResponseDecrypted = {
    noteId: randomNoteId,
    noteHeading: 'This is a sample note heading',
    noteBody: 'Sample note body',
    lastUpdated: sampleResponse.lastUpdated
}

/**
 * Initial state of the `NoteEditor` component
 */
const noteEditorInitialState = {
    heading: '',
    note: '',
    lastUpdated: null,
    error: null,
    errorAck: false,
    noteId: null,
    fetchingNow: false
}

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
};

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
            wrapper = setup({}, { location: { search: { id: randomNoteId } } });
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
        secretKey: validDecryptedKey,
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

        it('should display an error message on click event of `save` button when both heading and body are empty', () => {
            const actionComponent = findByTestAttr(wrapper, 'component-action').dive();
            const saveBtn = findByIdSelector(actionComponent, 'saveBtn');
            saveBtn.simulate('click');
            const errorAlert = findByTestAttr(wrapper, 'component-alert');
            expect(errorAlert.length).toBe(1);
        });
    });

    describe('`NoteEditor` with url params', () => {

        const expectedState = {
            ...noteEditorInitialState,
            noteId: sampleResponseDecrypted.noteId,
            heading: sampleResponseDecrypted.noteHeading,
            note: sampleResponseDecrypted.noteBody,
            lastUpdated: sampleResponseDecrypted.lastUpdated,
            fetchingNow: false
        };

        beforeEach(() => {
            moxios.install();
        });

        afterEach(() => {
            moxios.uninstall();
        });

        it('should render the spinner component', () => {
            const wrapper = setup({ auth: authUpdatedState }, { location: { search: { id: randomNoteId } } });
            const spinner = findByTestAttr(wrapper, 'component-spinner');
            expect(spinner.length).toBe(1);
        })

        it('should updated the state with mocked data from server', (done) => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: sampleResponse
                }).then(() => {
                    const receivedState = wrapper.instance().state;
                    expect(receivedState).toStrictEqual(expectedState);
                    done();
                });
            })
            const wrapper = setup({ auth: authUpdatedState }, { location: { search: { id: randomNoteId } } });
        });

        it('should display an error message on click event of `save` button when both heading and body are empty', (done) => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: sampleResponse
                }).then(() => {
                    wrapper.setState({
                        heading: '',
                        note: '',
                        lastUpdated: null,
                    });
                    const actionComponent = findByTestAttr(wrapper, 'component-action').dive();
                    const saveBtn = findByIdSelector(actionComponent, 'saveBtn');
                    saveBtn.simulate('click');
                    const errorAlert = findByTestAttr(wrapper, 'component-alert');
                    expect(errorAlert.length).toBe(1);
                    done();
                });
            });
            const wrapper = setup({ auth: authUpdatedState }, { location: { search: { id: randomNoteId } } });
        });
    });
});
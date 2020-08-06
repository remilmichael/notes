import React from 'react';
import { shallow } from 'enzyme';

import MainPage from './MainPage';
import { storeFactory, findByTestAttr, authInitialState } from '../../testUtils';
import { initialState as notelistInitialState } from '../../store/reducers/allNotes/allNotes';

/**
 * Factory function to create a ShallowWrapper for the GuessedWords component.
 * @function setup
 * @param {Object} initialState - Initial state for the setup
 * @param {Object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (initialState={}, props={}) => {
    const store = storeFactory(initialState);
    return shallow(<MainPage store={store} { ...props } />).dive().dive();
};

const sampleNotes = [
    { noteId: '123', noteHeading: 'Heading 1' },
    { noteId: '456', noteHeading: 'Heading 2' },
    { noteId: '789', noteHeading: 'Heading 2' },
    { noteId: '467', noteHeading: 'Heading 4' },
]

describe('Accessing `MainPage` without signing in', () => {
    
    let wrapper;

    beforeEach(() => {
        wrapper = setup();
    })

    it('should render the `New note` button', () => {
        const buttonComponent = findByTestAttr(wrapper, 'component-addbutton');
        expect(buttonComponent.length).toBe(1);
    });

    it('should NOT render any note list', () => {
        const noteItem = findByTestAttr(wrapper, 'component-note-item');
        expect(noteItem.length).toBe(0);
    });

});

describe('Accessing `MainPage` with credentials', () => {
    const authWithCredentials = {
        ...authInitialState,
        idToken: 'sampleToken123',
        userId: 'id123',
        expiresOn: new Date()
    };

    it('should render the spinner with `loading` message', () => {
        const noteListUpdatedState = {
            ...notelistInitialState,
            loading: true
        };
        const wrapper = setup({ auth: authWithCredentials, notelist: noteListUpdatedState });
        const loading = findByTestAttr(wrapper, 'component-loading');
        expect(loading.length).toBe(1);
    });

    it('should render the disabled button with failure message when fetching is failed', () => {
        const noteListUpdatedState = {
            ...notelistInitialState,
            fetchFailed: true
        };

        const wrapper = setup({ auth: authWithCredentials, notelist: noteListUpdatedState });
        const failedButton = findByTestAttr(wrapper, 'component-button-failed');
        expect(failedButton.length).toBe(1);
    });

    it('should render the button to load more notes from server', () => {
        const noteListUpdatedState = {
            ...notelistInitialState,
            hasMoreNotes: true,
            nextRecordNumber: 11
        };

        const wrapper = setup({ auth: authWithCredentials, notelist: noteListUpdatedState });
        const loadMoreButton = findByTestAttr(wrapper, 'component-loadmore');
        expect(loadMoreButton.length).toBe(1);
    });


    describe('Rendering note titles', () => {
        
        it('should render all note titles with `load more` button', () => {
            const noteListUpdatedState = {
                ...notelistInitialState,
                notes: sampleNotes,
                hasMoreNotes: true,
                nextRecordNumber: 4,
            };
    
            const wrapper = setup({ auth: authWithCredentials, notelist: noteListUpdatedState });
            const noteItem = findByTestAttr(wrapper, 'component-note-item');
            expect(noteItem.length).toBe(sampleNotes.length);
            const loadMoreButton = findByTestAttr(wrapper, 'component-loadmore');
            expect(loadMoreButton.length).toBe(1);
        });

        it('should render all note titles WITHOUT `load more` button', () => {
            const noteListUpdatedState = {
                ...notelistInitialState,
                notes: sampleNotes,
                hasMoreNotes: false,
                nextRecordNumber: 4,
            };
    
            const wrapper = setup({ auth: authWithCredentials, notelist: noteListUpdatedState });
            const noteItem = findByTestAttr(wrapper, 'component-note-item');
            expect(noteItem.length).toBe(sampleNotes.length);
            const loadMoreButton = findByTestAttr(wrapper, 'component-loadmore');
            expect(loadMoreButton.length).toBe(0);
        });
    });
});
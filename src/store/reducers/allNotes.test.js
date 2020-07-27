import * as actionTypes from '../actions/actionTypes';
import { reducer } from './allNotes';

const initialState = {
    notes: [], // [{ noteId - String, noteHeading - String }]
    nextRecordNumber: 0,
    hasMoreNotes: true,
    loading: false,
    fetchFailed: false,
    PAGE_SIZE: 10
}

const sampleNotes = [
    { noteId: '123', noteHeading: 'Heading 1' },
    { noteId: '456', noteHeading: 'Heading 2' },
    { noteId: '789', noteHeading: 'Heading 2' },
    { noteId: '467', noteHeading: 'Heading 4' },
    { noteId: 'abcd', noteHeading: 'Heading 5' },
]

describe('allNotes Reducer', () => {
    
    test('should return initialState when no action and state is passed', () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    describe('action type `SAVE_NOTES_LIST`', () => {
        
        describe('When NO existing note titles exists in state', () => {

            test('should return the updated state when NO new titles are received', () => {
                const emptyArray = [];
                const newState = reducer(initialState, { type: actionTypes.SAVE_NOTES_LIST, payload: emptyArray });
                const expectedState = {
                    ...initialState,
                    hasMoreNotes: false,
                    loading: false,
                    fetchFailed: false
                };
                expect(newState).toEqual({ ...initialState, ...expectedState });
            });
    
            test('should return the updated state when new titles are received', () => {
                const newReceivedNotes = [{ noteId: 'xyz', noteHeading: 'Test Heading new' }, { noteId: 'lmn', noteHeading: 'Test Heading new 2' }];
                const newState = reducer(initialState, { type: actionTypes.SAVE_NOTES_LIST, payload: newReceivedNotes });
                const expectedState = {
                    ...initialState,
                    nextRecordNumber: newReceivedNotes.length,
                    notes: newReceivedNotes,
                    hasMoreNotes: false
                }
                expect(newState).toEqual(expectedState)
            });

            test('should return updated state when 10 or more note titles are received from server', () => {
                const newReceivedNotes = [
                    { noteId: '123', noteHeading: 'Heading 1' },
                    { noteId: '456', noteHeading: 'Heading 2' },
                    { noteId: '789', noteHeading: 'Heading 2' },
                    { noteId: '467', noteHeading: 'Heading 4' },
                    { noteId: 'abcd', noteHeading: 'Heading 5' },
                    { noteId: '131', noteHeading: 'Heading 6' },
                    { noteId: '454', noteHeading: 'Heading 7' },
                    { noteId: '785', noteHeading: 'Heading 8' },
                    { noteId: '4sdc7', noteHeading: 'Heading 9' },
                    { noteId: 'an37dcb6', noteHeading: 'Heading 10' },
                ];

                const newState = reducer(initialState, { type:actionTypes.SAVE_NOTES_LIST, payload: newReceivedNotes });
                const expectedState = {
                    ...initialState,
                    notes: [...newReceivedNotes],
                    nextRecordNumber: newReceivedNotes.length,
                    hasMoreNotes: true,
                };
                expect(newState).toEqual(expectedState);
            });
        });



        describe('When there are existing note titles exists in state', () => {

            const updatedInitialState = {
                ...initialState,
                notes: [...sampleNotes]
            };

            test('should return the updated state when NO new titles are received', () => {
                const emptyArray = [];
                const newState = reducer(updatedInitialState, { type: actionTypes.SAVE_NOTES_LIST, payload: emptyArray });
                const expectedState = {
                    ...initialState,
                    notes: [...sampleNotes],
                    hasMoreNotes: false,
                    loading: false,
                    fetchFailed: false
                };
                expect(newState).toEqual({ ...initialState, ...expectedState });
            });
    
            test('should return the updated state when new titles are received', () => {
                const newReceivedNotes = [{ noteId: 'xyz', noteHeading: 'Test Heading new' }, { noteId: 'lmn', noteHeading: 'Test Heading new 2' }];
                const newState = reducer(updatedInitialState, { type: actionTypes.SAVE_NOTES_LIST, payload: newReceivedNotes });
                const expectedState = {
                    ...initialState,
                    nextRecordNumber: newReceivedNotes.length,
                    notes: [...sampleNotes, ...newReceivedNotes],
                    hasMoreNotes: false
                }
                expect(newState).toEqual(expectedState)
            });
        });
        
    });

    describe('action type `SAVE_NOTE_REDUX`', () => {
        
    });

});
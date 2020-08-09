import * as actionTypes from '../../actions/actionTypes';
import { reducer } from './notelist';

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
];

describe('`allNotes` Reducer', () => {
    
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
                expect(newState).toEqual(expectedState);
            });
        });
        
    });

    describe('action type `SAVE_NOTE_REDUX`', () => {
        
        describe('When no titles exists', () => {
            
            test('should return the updated state when a new title is added', () => {
                const payload = { noteId: 'id234', noteHeading: 'Sample note heading' };
                const newState = reducer(initialState, { type: actionTypes.SAVE_NOTE_REDUX, payload: payload});
                const expectedState = {
                    ...initialState,
                    notes: [payload],
                    nextRecordNumber: initialState.nextRecordNumber + 1
                }
                expect(newState).toEqual(expectedState);
            });

        });

        describe('When some titles already exists - Should add new title to beginning of the array', () => {
            test('should return the updated state when a new title is added', () => {
                const updatedState = { ...initialState, notes: [...sampleNotes], nextRecordNumber: sampleNotes.length };
                const payload = { noteId: 'id234', noteHeading: 'Sample note heading' };
                const newState = reducer(updatedState, { type: actionTypes.SAVE_NOTE_REDUX, payload: payload});
                const expectedState = {
                    ...initialState,
                    notes: [payload, ...sampleNotes],
                    nextRecordNumber: sampleNotes.length + 1
                }
                expect(newState).toEqual(expectedState);
            });
        });

    });

    describe('action type `DELETE_NOTE_REDUX`', () => {
        test('should return the updated state after a note is deleted from redux store', () => {
            const updatedState = { ...initialState, notes: [...sampleNotes], nextRecordNumber: sampleNotes.length };
            const noteIdToDelete = 'abcd';
            const newState = reducer(updatedState, { type: actionTypes.DELETE_NOTE_REDUX, payload: noteIdToDelete });
            const updatedNotes = sampleNotes.filter(note => {
                return note.noteId !== noteIdToDelete;
            })
            const expectedState = {
                ...initialState,
                notes: [...updatedNotes],
                nextRecordNumber: sampleNotes.length - 1
            }
            expect(newState).toEqual(expectedState);
        });
    });

    /* Leaving two action types since they simple actions */
    // FETCH_MORE_NOTES_START
    // FETCH_NOTES_TITLES_FAILED

});
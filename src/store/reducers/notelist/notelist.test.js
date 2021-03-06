import * as actionTypes from '../../actions/actionTypes';
import { reducer, initialState } from './notelist';

const sampleNotes = [
    { noteId: '123', noteHeading: 'Heading 1' },
    { noteId: '456', noteHeading: 'Heading 2' },
    { noteId: '789', noteHeading: 'Heading 2' },
    { noteId: '467', noteHeading: 'Heading 4' },
    { noteId: 'abcd', noteHeading: 'Heading 5' },
];

describe('`notelist` Reducer', () => {

    test('should return initialState when no action and state is passed', () => {
        const newState = reducer(undefined, {});
        expect(newState).toEqual(initialState);
    });

    describe('action type `SAVE_NOTES_LIST`', () => {

        describe('When NO existing note titles exists', () => {

            test('should return the updated state when NO new titles are received', () => {
                const emptyArray = [];
                const newState = reducer(initialState,
                    { type: actionTypes.SAVE_NOTES_LIST, payload: emptyArray });
                const expectedState = {
                    ...initialState,
                    hasMoreNotes: false,
                    loading: false,
                    fetchFailed: false
                };
                expect(newState).toEqual({ ...initialState, ...expectedState });
            });

            test('should return the updated state when new titles are received', () => {
                const newReceivedNotes = [
                    { noteId: 'xyz', noteHeading: 'Test Heading new' },
                    { noteId: 'lmn', noteHeading: 'Test Heading new 2' }
                ];
                const newState = reducer(initialState,
                    { type: actionTypes.SAVE_NOTES_LIST, payload: newReceivedNotes });
                const expectedState = {
                    ...initialState,
                    nextRecordNumber: newReceivedNotes.length,
                    notes: newReceivedNotes,
                    hasMoreNotes: false
                }
                expect(newState).toEqual(expectedState)
            });

            test('should return updated state when 10 or more note titles are received', () => {
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

                const newState = reducer(initialState, { type: actionTypes.SAVE_NOTES_LIST, payload: newReceivedNotes });
                const expectedState = {
                    ...initialState,
                    notes: [...newReceivedNotes],
                    nextRecordNumber: newReceivedNotes.length,
                    hasMoreNotes: true,
                };
                expect(newState).toEqual(expectedState);
            });
        });



        describe('When there are existing note titles in reducer', () => {

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
                const newReceivedNotes = [
                    { noteId: 'xyz', noteHeading: 'Test Heading new' },
                    { noteId: 'lmn', noteHeading: 'Test Heading new 2' }
                ];
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
                const newState = reducer(initialState, { type: actionTypes.SAVE_NOTE_REDUX, payload: payload });
                const expectedState = {
                    ...initialState,
                    notes: [payload],
                    nextRecordNumber: initialState.nextRecordNumber + 1
                }
                expect(newState).toEqual(expectedState);
            });

        });

        describe('When some titles already exists', () => {
            test('should add new title to beginning of the array', () => {
                const updatedState = { ...initialState, notes: [...sampleNotes], nextRecordNumber: sampleNotes.length };
                const payload = { noteId: 'id234', noteHeading: 'Sample note heading' };
                const newState = reducer(updatedState, { type: actionTypes.SAVE_NOTE_REDUX, payload: payload });
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
            const updatedState = {
                ...initialState,
                notes: [...sampleNotes],
                nextRecordNumber: sampleNotes.length
            };
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

    describe('action type `UPDATE_NOTE_REDUX` - Put updated note to the beginning', () => {
        it('should return the updated notes list after a note has been updated', () => {
            const updatedState = {
                ...initialState,
                notes: [...sampleNotes],
                nextRecordNumber: sampleNotes.length
            };

            const noteIdToUpdate = '467';
            const receivedState = reducer(updatedState,
                { type: actionTypes.UPDATE_NOTE_REDUX, payload: sampleNotes[3] });
            const notes = sampleNotes.filter(note => {
                return note.noteId !== noteIdToUpdate;
            });
            notes.unshift(sampleNotes[3]); // updated note is in index 3, pushed to beginning
            const expectedState = {
                ...initialState,
                notes: notes,
                nextRecordNumber: sampleNotes.length
            };
            expect(receivedState).toEqual(expectedState);
        });
    });

    describe('action type `CLEAR_NOTE_REDUX`', () => {
        it('should return the initialState', () => {
            const updatedState = {
                ...initialState,
                notes: [...sampleNotes],
                nextRecordNumber: sampleNotes.length
            };
            const receivedState = reducer(updatedState,
                { type: actionTypes.CLEAR_NOTE_REDUX });
            expect(receivedState).toEqual(initialState);
        });
    });

    describe('action type `FETCH_MORE_NOTES_START`', () => {
        it('should return the updated state with `loading` set to `true`', () => {
            const expectedState = {
                ...initialState,
                loading: true
            };
            const receivedState = reducer(initialState, { type: actionTypes.FETCH_MORE_NOTES_START });
            expect(receivedState).toEqual(expectedState);
        });
    });

    describe('action type `FETCH_NOTES_TITLES_FAILED`', () => {
        it('should update state with `loading` set to `false` and `fetchFailed` to `true`', () => {
            const expectedState = {
                ...initialState,
                loading: false,
                fetchFailed: true
            }
            const receivedState = reducer(initialState, { type: actionTypes.FETCH_NOTES_TITLES_FAILED });
            expect(receivedState).toEqual(expectedState);
        });
    });
});
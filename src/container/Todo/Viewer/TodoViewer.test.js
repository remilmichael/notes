import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import TodoViewer from './TodoViewer';
import { storeFactory, authInitialState } from '../../../testUtils';

const authUpdatedState = {
    ...authInitialState,
    idToken: "sampleToken123",
    userId: "id123",
    expiresOn: new Date(),
};

let history = createMemoryHistory();
const setup = () => {
    history = createMemoryHistory();
    const store = storeFactory();
    store.getState().auth = authUpdatedState;
    render(
        <Provider store={store}>
            <Router history={history}>
                <TodoViewer />
            </Router>
        </Provider>
    );
}


describe("Accessing TodoViewer without logging in", () => {
    const history = createMemoryHistory();

    it("should redirect to `/login`", () => {
        const store = storeFactory();
        render(
            <Provider store={store}>
                <Router history={history}>
                    <TodoViewer />
                </Router>
            </Provider>
        );
        expect(history.location.pathname).toEqual("/login");
        expect(history.action).toEqual('PUSH');
    });
});
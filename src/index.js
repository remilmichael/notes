import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';
import noteReducer from './store/reducers/notes/notes';
import authReducer from './store/reducers/auth/auth';
import msgReducer from './store/reducers/message/message';
import noteListReducer from './store/reducers/notelist/notelist';
import todoListReducer from './store/reducers/todolist/todolist';

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const composeEnhancers = compose;

export const rootReducer = combineReducers({
  note: noteReducer,
  auth: authReducer,
  message: msgReducer,
  notelist: noteListReducer,
  todolist: todoListReducer,
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

const app = (
  <Provider store={store}>
    <BrowserRouter basename="/">
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

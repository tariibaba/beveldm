import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  downloadsReducer,
  currentNotificationReducer,
  settingsReducer
} from './reducers';
import reduxThunk from 'redux-thunk';
import 'typeface-roboto';
import { windowProgressSyncer } from './middlewares';

const store = createStore(
  combineReducers({
    downloads: downloadsReducer,
    currentNotification: currentNotificationReducer,
    settings: settingsReducer
  }),
  applyMiddleware(reduxThunk, windowProgressSyncer)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

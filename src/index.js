import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  downloadsReducer,
  intervalReducer,
  intervalSubscribersReducer,
  currentNotificationReducer,
  settingsReducer
} from './reducers';
import reduxThunk from 'redux-thunk';
import 'typeface-roboto';

const store = createStore(
  combineReducers({
    downloads: downloadsReducer,
    interval: intervalReducer,
    intervalSubscribers: intervalSubscribersReducer,
    currentNotification: currentNotificationReducer,
    settings: settingsReducer
  }),
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  downloads,
  interval,
  intervalSubscribers,
  currentNotification,
  settings
} from './reducers';
import reduxThunk from 'redux-thunk';
import 'typeface-roboto';

const store = createStore(
  combineReducers({
    downloads,
    interval,
    intervalSubscribers,
    currentNotification,
    settings
  }),
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { downloads, interval, intervalSubscribers } from './reducers';
import reduxThunk from 'redux-thunk';
import 'typeface-roboto/index.css';

const store = createStore(
  combineReducers({ downloads, interval, intervalSubscribers }),
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  downloadsReducer,
  currentNotificationReducer,
  settingsReducer,
  downloadGroupReducer,
  dialogReducer,
  pageReducer
} from './reducers';
import reduxThunk from 'redux-thunk';
import 'typeface-roboto';
import { windowProgressSyncer, stateSaver } from './middlewares';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  combineReducers({
    downloads: downloadsReducer,
    currentNotification: currentNotificationReducer,
    settings: settingsReducer,
    downloadGroup: downloadGroupReducer,
    dialog: dialogReducer,
    page: pageReducer
  }),
  composeWithDevTools(
    applyMiddleware(reduxThunk, stateSaver, windowProgressSyncer)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

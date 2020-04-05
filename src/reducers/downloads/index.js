import { combineReducers } from 'redux';

import byIdReducer from './byId';
import allIdsReducer from './allIds';

export default combineReducers({
  byId: byIdReducer,
  allIds: allIdsReducer
});

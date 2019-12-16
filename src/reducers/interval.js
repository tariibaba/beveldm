import { SET_INTERVAL } from '../actions';
import { createReducer } from './utilities';

export default createReducer(null, {
  [SET_INTERVAL]: setInterval
});

function setInterval(state, action) {
  return action.interval;
}

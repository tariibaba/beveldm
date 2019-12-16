import { SUBSCRIBE_TO_INTERVAL, UNSUBSCRIBE_FROM_INTERVAL } from '../actions';
import { createReducer } from './utilities';

export default createReducer([], {
  [SUBSCRIBE_TO_INTERVAL]: subscribeToInterval,
  [UNSUBSCRIBE_FROM_INTERVAL]: unsubscribeToInterval
});

function subscribeToInterval(state, action) {
  return [
    ...state,
    {
      id: action.id,
      action: action.action
    }
  ];
}

function unsubscribeToInterval(state, action) {
  return state.filter(subscriber => subscriber.id !== action.id);
}

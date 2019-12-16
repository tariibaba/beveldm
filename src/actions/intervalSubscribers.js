import { SUBSCRIBE_TO_INTERVAL, UNSUBSCRIBE_FROM_INTERVAL } from './constants';

export function subscribeToInterval(id, action) {
  return {
    type: SUBSCRIBE_TO_INTERVAL,
    id,
    action
  };
}

export function unsubscribeFromInterval(id) {
  return {
    type: UNSUBSCRIBE_FROM_INTERVAL,
    id
  };
}

import { unsubscribeFromInterval } from '../actions';

export default function unsubscribeFromIntervalThunk(id) {
  return async (dispatch, getState) => {
    dispatch(unsubscribeFromInterval(id)); 
    const state = getState();
    if (state.intervalSubscribers.length === 0) {
      clearInterval(state.interval);
    }
    return Promise.resolve();
  };
}

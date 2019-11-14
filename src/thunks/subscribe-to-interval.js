import { subscribeToInterval, setDownloadInterval } from '../actions';

export function thunkSubscribeToInterval(id, action) {
  return async (dispatch, getState) => {
    if (getState().intervalSubscribers.length === 0) {
      dispatch(thunkSetDownloadInterval());
    }
    dispatch(subscribeToInterval(id, action));
  };
}

function thunkSetDownloadInterval() {
  return async (dispatch, getState) => {
    let state = getState();
    const interval = setInterval(() => {
      state = getState();
      state.intervalSubscribers.forEach(subscriber => {
        subscriber.action();
      });
      if (state.intervalSubscribers.length === 0) {
        clearInterval(interval);
      }
    }, 500);
    dispatch(setDownloadInterval(interval));
  };
}

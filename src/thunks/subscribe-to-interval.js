import { subscribeToInterval, setDownloadsInterval } from '../actions';


export default function subscribeToIntervalThunk(id, action) {
  return async (dispatch, getState) => {
    if (getState().intervalSubscribers.length === 0) {
      dispatch(setDownloadsIntervalThunk());
    }
    dispatch(subscribeToInterval(id, action));
  };
}

function setDownloadsIntervalThunk() {
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
    dispatch(setDownloadsInterval(interval));
  };
}

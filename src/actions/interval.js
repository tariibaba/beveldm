import { SET_INTERVAL } from './constants';

export function setDownloadsInterval(interval) {
  return {
    type: SET_INTERVAL,
    interval
  };
}

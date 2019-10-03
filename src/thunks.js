import { startDownload } from './actions';
import httpPromise from './http-promise';

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    const res = httpPromise(download.url);
    dispatch(startDownload(id, res));
  };
}

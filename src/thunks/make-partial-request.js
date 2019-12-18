import http from 'http';
import https from 'https';
import { setDownloadError } from '../actions';
import changeDownloadStatusThunk from './change-download-status';

export default function makePartialRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, _getState) => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    const options = {
      headers: {
        Connection: 'keep-alive',
        Range: `bytes=${rangeStart}-${rangeEnd || ''}`
      }
    };

    return new Promise(resolve => {
      protocol
        .get(url, options)
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(setDownloadError(id, { code: 'ERR_FORBIDDEN' }));
            dispatch(changeDownloadStatusThunk(id, 'error'));
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(setDownloadError(id, { code: err.code }));
          dispatch(changeDownloadStatusThunk(id, 'error'));
        });
    });
  };
}

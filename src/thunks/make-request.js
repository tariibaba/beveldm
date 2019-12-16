import http from 'http';
import https from 'https';
import { setDownloadError, changeDownloadStatus } from '../actions';

export default function makeRequest(id, url) {
  return async (dispatch, _getState) => {
    return new Promise(resolve => {
      const protocol = new URL(url).protocol === 'http:' ? http : https;
      protocol
        .get(url, { headers: { Connection: 'keep-alive' } })
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(setDownloadError(id, { code: 'ERR_FORBIDDEN' }));
            dispatch(changeDownloadStatus(id, 'error'));
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(setDownloadError(id, { code: err.code }));
          dispatch(changeDownloadStatus(id, 'error'));
        });
    });
  };
}

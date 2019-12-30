import http from 'http';
import https from 'https';
import { showDownloadError } from '../actions';

export default function makeRequest(id, url) {
  return async (dispatch, _getState) => {
    return new Promise(resolve => {
      const protocol = new URL(url).protocol === 'http:' ? http : https;
      const options = { headers: { Connection: 'keep-alive' } };

      protocol
        .get(url, options)
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(showDownloadError(id, { code: 'EFORBIDDEN' }));
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(showDownloadError(id, { code: 'EFORBIDDEN' }));
        });
    });
  };
}

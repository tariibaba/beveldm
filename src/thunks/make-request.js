import http from 'http';
import https from 'https';
import setDownloadErrorThunk from './set-download-error';

export default function makeRequest(id, url) {
  return async (dispatch, _getState) => {
    return new Promise(resolve => {
      const protocol = new URL(url).protocol === 'http:' ? http : https;
      const options = { headers: { Connection: 'keep-alive' } };

      protocol
        .get(url, options)
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(setDownloadErrorThunk(id, { code: 'ERR_FORBIDDEN' }));
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(setDownloadErrorThunk(id, { code: err.code }));
        });
    });
  };
}

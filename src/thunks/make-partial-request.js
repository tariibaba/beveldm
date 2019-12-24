import http from 'http';
import https from 'https';
import setDownloadErrorThunk from './set-download-error';

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
            dispatch(setDownloadErrorThunk(id, { code: 'EFORBIDDEN' }));
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(setDownloadErrorThunk(id, { code: err.code }));
        });
    });
  };
}

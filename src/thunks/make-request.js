import http from 'http';
import https from 'https';
import { downloadError } from '../actions';

export default function makeRequest(id, url) {
  return async (dispatch, _getState) => {
    return new Promise(resolve => {
      const protocol = new URL(url).protocol === 'http:' ? http : https;
      protocol
        .get(url, { headers: { Connection: 'keep-alive' }})
        .on('response', res => resolve(res))
        .on('error', err => dispatch(downloadError(id, { code: err.code })));
    });
  };
}

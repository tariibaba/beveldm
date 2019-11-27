import http from 'http';
import https from 'https';
import { downloadError } from '../actions';

export default function makePartialRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (!rangeEnd) rangeEnd = download.size;
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    return new Promise(resolve => {
      protocol
        .get(url, {
          headers: {
            Connection: 'keep-alive',
            Range: `bytes=${rangeStart}-${rangeEnd}`
          }
        })
        .on('response', res => resolve(res))
        .on('error', err => dispatch(downloadError(id, { code: err.code })));
    });
  };
}

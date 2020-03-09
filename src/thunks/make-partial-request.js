import http from 'http';
import https from 'https';
import { showDownloadError } from '../actions';
import ytdl from 'ytdl-core';

export default function makePartialRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, _getState) => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    const options = {
      headers: {
        Connection: 'keep-alive',
        Range: `bytes=${rangeStart}-${rangeEnd || ''}`
      }
    };

    return new Promise((resolve, reject) => {
      protocol
        .get(url, options)
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(showDownloadError(id, { code: 'EFORBIDDEN' }));
            reject('Forbidden request');
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(showDownloadError(id, { code: err.code }));
          reject('Error with request');
        });
    });
  };
}

export function makePartialYouTubeRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id);
    return new Promise((resolve, reject) => {
      ytdl(url, {
        range: { start: rangeStart, end: rangeEnd },
        format: download.format
      })
        .on('response', res => {
          if (res.statusCode === 403) {
            dispatch(showDownloadError(id, { code: 'EFORBIDDEN' }));
            reject('Forbidden request');
          }
          resolve(res);
        })
        .on('error', err => {
          dispatch(showDownloadError(id, { code: err.code }));
          reject('Error with request');
        });
    });
  };
}

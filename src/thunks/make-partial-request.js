import http from 'http';
import https from 'https';
import downloadErrorThunk from './download-error';
import ytdl from 'ytdl-core';

export default function makePartialRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, _getState) => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    const options = {
      headers: {
        Connection: 'keep-alive',
        Range: `bytes=${rangeStart}-${rangeEnd || ''}`,
      },
    };

    return new Promise((resolve, reject) => {
      protocol
        .get(url, options)
        .on('response', (res) => {
          if (res.statusCode === 403) {
            dispatch(downloadErrorThunk(id, 'EFORBIDDEN'));
            reject('EFORBIDDEN');
          }
          if (res.statusCode === 416) {
            dispatch(downloadErrorThunk(id, 'ERANGENOTSATISFIABLE'));
            reject('ERANGENOTSATISFIABLE');
          }
          resolve(res);
        })
        .on('error', (err) => {
          dispatch(downloadErrorThunk(id, err.code));
        });
    });
  };
}

export function makePartialYouTubeRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    return new Promise((resolve, reject) => {
      ytdl(url, {
        range: { start: rangeStart, end: rangeEnd },
        format: download.format,
      })
        .on('response', (res) => {
          if (res.statusCode === 403) {
            dispatch(downloadErrorThunk(id, 'EFORBIDDEN'));
            reject('EFORBIDDEN');
          }
          resolve(res);
        })
        .on('error', (err) => {
          dispatch(downloadErrorThunk(id, err.code));
        });
    });
  };
}

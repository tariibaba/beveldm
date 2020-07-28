import http from 'http';
import https from 'https';
import downloadErrorThunk from './download-error';
import ytdl from 'ytdl-core';
import { changeDownloadUrl } from '../actions';

export default function makePartialRequest(id, url, rangeStart, rangeEnd) {
  return async (dispatch, _getState) => {
    const protocol = new URL(url).protocol === 'http:' ? http : https;
    const options = {
      headers: {
        Connection: 'keep-alive',
        Range: `bytes=${rangeStart || 0}-${rangeEnd || ''}`,
      },
    };

    return new Promise((resolve, reject) => {
      protocol
        .get(url, options)
        .on('response', async (res) => {
          if (res.statusCode === 403) {
            dispatch(downloadErrorThunk(id, 'EFORBIDDEN'));
            reject('EFORBIDDEN');
          } else if (res.statusCode === 416) {
            dispatch(downloadErrorThunk(id, 'ERANGENOTSATISFIABLE'));
            reject('ERANGENOTSATISFIABLE');
          } else if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
            const location = res.headers['Location'] || res.headers['location'];
            if (location) {
              const newUrl = new URL(location, new URL(url).origin).href;
              dispatch(changeDownloadUrl(id, newUrl));
              dispatch(makePartialRequest(id, newUrl, rangeStart, rangeEnd))
                .then(resolve)
                .catch(reject);
            }
          }
          resolve(res);
        })
        .on('error', (err) => {
          dispatch(downloadErrorThunk(id, err.code));
          reject(err.code);
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
          reject(err.code);
        });
    });
  };
}

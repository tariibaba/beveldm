import http from 'http';
import https from 'https';
import ytdl from 'ytdl-core';
import downloadErrorThunk from './download-error';

export default function makeRequest(id, url) {
  return (dispatch, _getState) => {
    return new Promise((resolve, reject) => {
      const protocol = new URL(url).protocol === 'http:' ? http : https;
      const options = { headers: { Connection: 'keep-alive' } };

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

export function makeYouTubeRequest(id, url) {
  return (dispatch, getState) => {
    const download = getState().downloads.byId[id];

    return new Promise((resolve) => {
      ytdl(url, { format: download.format })
        .on('response', (res) => {
          if (res.statusCode === 403) {
            dispatch(downloadErrorThunk(id, 'EFORBIDDEN'));
          }
          resolve(res);
        })
        .on('error', (err) => {
          dispatch(downloadErrorThunk(id, err.code));
        });
    });
  };
}

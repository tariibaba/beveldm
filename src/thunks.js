import { startDownload, updateBytesDownloaded, pauseDownload, resumeDownload, completeDownload } from './actions';
import { httpGetPromise } from './promisified';
import { resolve } from 'path';
import fs from 'fs';

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const res = await httpGetPromise(download.url);
    dispatch(startDownload(id, res));

    res.on('data', chunk => {
      res.pause();
      download = getState().downloads.find(download => download.id === id);
      fs.appendFile(resolve(download.dirname, download.filename), chunk, err => {
        const received = download.bytesDownloaded + chunk.length;
        dispatch(
          updateBytesDownloaded(id, received)
        );
        if (received === download.size)
          dispatch(completeDownload(id))
        res.resume();
      });
    });
  };
}

export function thunkPauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    download.res.destroy();
    dispatch(pauseDownload(id));
  };
}

export function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const url = new URL(download.url);
    const res = await httpGetPromise({
      host: url.hostname,
      port: url.port,
      headers: {
        'Range':  `bytes=${download.bytesDownloaded}-`
      }
    });
    dispatch(resumeDownload(id, res));

    res.on('data', chunk => {
      res.pause();
      download = getState().downloads.find(download => download.id === id);
      fs.appendFile(resolve(download.dirname, download.filename), chunk, err => {
        const received = download.bytesDownloaded + chunk.length;
        dispatch(
          updateBytesDownloaded(id, received)
        );
        if (received === download.size)
          dispatch(completeDownload(id));
        res.resume();
      });
    });
  };
}

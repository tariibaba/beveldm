import { startDownload, updateBytesDownloaded, pauseDownload, resumeDownload, completeDownload, cancelDownload } from './actions';
import { httpGetPromise } from './promisified';
import { resolve } from 'path';
import fs from 'fs';

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const res = await httpGetPromise(
      download.url,
      {
        headers: {
          Range: 'bytes=0-',
          Connection: 'keep-alive',
        }
      }
    );
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
        if (download.status !== 'paused')
          res.resume();
      });
    });
  };
}

export function thunkPauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    download.res.pause();
    dispatch(pauseDownload(id));
  };
}

export function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    download.res.resume();
    dispatch(resumeDownload(id, download.res));
  };
}

export function thunkCancelDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    download.res.destroy();
    dispatch(cancelDownload(id));
  };
}

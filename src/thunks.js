import { startDownload, updateBytesDownloaded, pauseDownload } from './actions';
import httpPromise from './http-promise';
import { ipcRenderer } from 'electron';
import { resolve } from 'path';

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const res = await httpPromise(download.url);
    dispatch(startDownload(id, res));

    let data;
    res.on('data', chunk => {
      data = chunk;
      res.pause();
      download = getState().downloads.find(download => download.id === id);
      ipcRenderer.send('write-file', {
        path: resolve(download.dirname, download.filename),
        data
      });
    });

    ipcRenderer.on('written-file', () => {
      dispatch(
        updateBytesDownloaded(id, download.bytesDownloaded + data.length)
      );
      res.resume();
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

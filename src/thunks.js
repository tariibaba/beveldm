import {
  startDownload,
  updateBytesDownloaded,
  pauseDownload,
  resumeDownload,
  completeDownload,
  cancelDownload,
  setDownloadInterval,
  subscribeToInterval,
  removeDownload
} from './actions';
import { httpGetPromise } from './promisified';
import { resolve } from 'path';
import fs from 'fs';

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const res = await httpGetPromise(download.url, {
      headers: {
        Range: 'bytes=0-',
        Connection: 'keep-alive'
      }
    });
    dispatch(startDownload(id, res, res.statusCode === 206));

    const fullPath = resolve(download.dirname, download.filename);
    const stream = fs.createWriteStream(fullPath);
    res
      .on('data', chunk => {
        res.pause();
        download = getState().downloads.find(download => download.id === id);
        stream.write(chunk, err => {
          if (err) throw err;
          const received = download.bytesDownloaded + chunk.length;
          dispatch(updateBytesDownloaded(id, received));
          if (received === download.size) dispatch(completeDownload(id));
          if (download.status !== 'paused') res.resume();
        });
      })
      .on('end', () => {
        stream.close();
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

    if (download.res) {
      download.res.resume();
      dispatch(resumeDownload(id, download.res));
    } else {
      let download = getState().downloads.find(download => download.id === id);

      const res = await httpGetPromise(download.url, {
        headers: {
          Range: `bytes=${download.bytesDownloaded}-`,
          Connection: 'keep-alive'
        }
      });
      dispatch(resumeDownload(id, res));

      const fullPath = resolve(download.dirname, download.filename);
      let stream;
      if (!download.resumable) {
        dispatch(updateBytesDownloaded(id, 0));
        stream = fs.createWriteStream(fullPath);
      } else stream = fs.createWriteStream(fullPath, { flags: 'a' });

      res
        .on('data', chunk => {
          res.pause();
          download = getState().downloads.find(download => download.id === id);
          console.log('bytesDownloaded: ' + download.bytesDownloaded);
          stream.write(chunk, err => {
            if (err) throw err;
            const received = download.bytesDownloaded + chunk.length;
            dispatch(updateBytesDownloaded(id, received));
            if (received === download.size) dispatch(completeDownload(id));
            if (download.status !== 'paused') res.resume();
          });
        })
        .on('end', () => {
          stream.close();
        });
    }
  };
}

export function thunkCancelDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    download.res.destroy();
    dispatch(cancelDownload(id));
  };
}

export function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const fullPath = resolve(download.dirname, download.filename);
    dispatch(removeDownload(id));
    if (download.status === 'canceled') fs.unlink(fullPath, _err => {});
  };
}

export function thunkSubscribeToInterval(id, action) {
  return async (dispatch, getState) => {
    if (getState().intervalSubscribers.length === 0) {
      dispatch(thunkSetDownloadInterval());
    }
    dispatch(subscribeToInterval(id, action));
  };
}

function thunkSetDownloadInterval() {
  return async (dispatch, getState) => {
    let state = getState();
    const interval = setInterval(() => {
      state = getState();
      state.intervalSubscribers.forEach(subscriber => {
        subscriber.action();
      });
      if (state.intervalSubscribers.length === 0) {
        clearInterval(interval);
      }
    }, 500);
    dispatch(setDownloadInterval(interval));
  };
}

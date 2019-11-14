import {
  startDownload,
  updateBytesDownloaded,
  pauseDownload,
  resumeDownload,
  completeDownload,
  cancelDownload,
  setDownloadInterval,
  subscribeToInterval,
  removeDownload,
  startingDownload,
  addNewDownload
} from './actions';
import { httpGetPromise } from './promisified';
import path, { resolve } from 'path';
import fs from 'fs';
import Store from 'electron-store';
import pathExists from 'path-exists';
import contentDipositionFilename from 'content-disposition-filename';
import { PARTIAL_DOWNLOAD_EXTENSION } from './constants';
import pify from 'pify';

export function thunkAddNewDownload(url, dirname) {
  return async (dispatch, getState) => {
    const res = await httpGetPromise(url);
    const downloads = getState().downloads;
    dispatch(
      addNewDownload(
        url,
        dirname,
        await getAvailableFileName(
          dirname,
          getFileName(url, res.headers),
          downloads
        ),
        getFileSize(res.headers)
      )
    );
  };
}

async function getAvailableFileName(dirname, filename, downloads) {
  const extension = path.extname(filename);
  const nameWithoutExtension = filename.replace(extension, '');
  let availableWithoutExtension;
  let suffix = 0;
  let availableFilename = filename;
  let fullPath = path.resolve(dirname, availableFilename);
  let partialDownloadFullPath = path.resolve(dirname, nameWithoutExtension);

  while (
    (await pathExists(fullPath)) ||
    (await pathExists(partialDownloadFullPath))
  ) {
    suffix++;
    availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
    availableFilename = availableWithoutExtension + extension;
    fullPath = path.resolve(dirname, availableFilename);
    partialDownloadFullPath = path.resolve(
      dirname,
      availableWithoutExtension + PARTIAL_DOWNLOAD_EXTENSION
    );
  }

  downloads.forEach(download => {
    const downloadPath = path.resolve(download.dirname, download.filename);
    if (downloadPath === fullPath || downloadPath === partialDownloadFullPath) {
      suffix++;
      availableWithoutExtension = `${nameWithoutExtension} (${suffix})`;
      availableFilename = availableWithoutExtension + extension;
      fullPath = path.resolve(dirname, availableFilename);
      partialDownloadFullPath = path.resolve(
        dirname,
        availableWithoutExtension + PARTIAL_DOWNLOAD_EXTENSION
      );
    }
  });
  return availableFilename;
}

function getFileName(url, headers) {
  if (headers['content-disposition'])
    return contentDipositionFilename(headers['content-disposition']);
  else {
    const urlobj = new URL(url);
    return path.basename(urlobj.origin + urlobj.pathname);
  }
}

function getFileSize(headers) {
  return parseInt(headers['content-length']);
}

export function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.status === 'starting') return;
    dispatch(startingDownload(id));

    const res = await httpGetPromise(download.url, {
      headers: {
        Range: 'bytes=0-',
        Connection: 'keep-alive'
      }
    });
    dispatch(startDownload(id, res, res.statusCode === 206));

    const fullPath = resolve(
      download.dirname,
      replaceFileExt(download.filename, PARTIAL_DOWNLOAD_EXTENSION)
    );
    const stream = fs.createWriteStream(fullPath);
    res
      .on('data', chunk => {
        res.pause();
        download = getState().downloads.find(download => download.id === id);
        stream.write(chunk, err => {
          if (err) throw err;
          const received = download.bytesDownloaded + chunk.length;
          dispatch(updateBytesDownloaded(id, received));
          if (received === download.size) dispatch(thunkCompleteDownload(id));
          if (download.status !== 'paused') res.resume();
        });
      })
      .on('end', () => {
        stream.close();
      });
  };
}

function replaceFileExt(filepath, newExt) {
  return filepath.replace(path.extname(filepath), newExt);
}

export function thunkPauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.status !== 'started') return;
    download.res.pause();
    dispatch(pauseDownload(id));
  };
}

export function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.id === 'starting') return;
    dispatch(startingDownload(id));

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

      const fullPath = resolve(
        download.dirname,
        replaceFileExt(download.filename, PARTIAL_DOWNLOAD_EXTENSION)
      );
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
            if (received === download.size) dispatch(thunkCompleteDownload(id));
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
    if (download.res) download.res.destroy();
    dispatch(cancelDownload(id));
  };
}

export function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const fullPath = resolve(download.dirname, download.filename);
    dispatch(removeDownload(id));
    if (download.status === 'canceled')
      fs.unlink(
        replaceFileExt(fullPath, PARTIAL_DOWNLOAD_EXTENSION),
        _err => {}
      );
  };
}

export function thunkCompleteDownload(id) {
  return async (dispatch, getState) => {
    const rename = pify(fs.rename, { multiArgs: true });
    const download = getState().downloads.find(download => download.id === id);
    await rename(
      replaceFileExt(
        path.resolve(download.dirname, download.filename),
        PARTIAL_DOWNLOAD_EXTENSION
      ),
      path.resolve(download.dirname, download.filename)
    );
    dispatch(completeDownload(id));
    return Promise.resolve();
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

export function saveState() {
  return async (dispatch, getState) => {
    getState().downloads.forEach(async download => {
      await dispatch(thunkPauseDownload(download.id));
    });
    const store = new Store();
    return new Promise(resolve => {
      setTimeout(() => {
        store.set(
          'downloads',
          getState().downloads.map(download => {
            const { res, ...d } = { ...download };
            return d;
          })
        );
        resolve();
      }, 50);
    });
  };
}

export function loadState() {
  return async (_dispatch, getState) => {
    const store = new Store();
    getState().downloads = store.get('downloads') || [];
  };
}

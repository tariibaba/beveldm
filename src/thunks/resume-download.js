import {
  resumeDownload,
  updateBytesDownloaded,
  downloadError,
  changeDownloadBasicInfo
} from '../actions';
import {
  getAvailableFilename,
  getPartialDownloadPath,
  deleteFile
} from './helpers';
import fs from 'fs';
import { getFilename, getFileSize } from './helpers';
import thunkDownloadFile from './download-file';
import makePartialRequest from './make-partial-request';

export default function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    const downloads = getState().downloads;
    let download = downloads.find(download => download.id === id);
    dispatch(resumeDownload(id));

    if (download.res) {
      download.res.resume();
    } else if (download.status === 'error') {
      dispatch(thunkResumeFromError(id, download.error.code));
    } else {
      const fullpath = getPartialDownloadPath(download);
      const res = await dispatch(
        makePartialRequest(id, download.url, download.bytesDownloaded)
      );

      dispatch(resumeDownload(id, res));
      const filename = getFilename(download.url, res.headers);
      const size = getFileSize(res.headers);
      if (download.filename !== filename || download.size !== size)
        dispatch(downloadError(id, { code: 'ERR_FILE_CHANGED' }));
      else {
        let stream;
        if (!download.resumable) {
          dispatch(updateBytesDownloaded(id, 0));
          stream = fs.createWriteStream(fullpath);
        } else stream = fs.createWriteStream(fullpath, { flags: 'a' });
        // The download status might have changed since dispatching resumeDownload
        download = getState().downloads.find(download => download.id === id);
        if (download.status === 'started') {
          dispatch(thunkDownloadFile(id, res, stream));
        }
      }
    }
    return Promise.resolve();
  };
}

function thunkResumeFromError(id, code) {
  return async (dispatch, getState) => {
    let res, stream;
    const downloads = getState().downloads;
    let download = downloads.find(download => download.id === id);
    switch (code) {
      case 'ERR_FILE_CHANGED':
        let fullpath = getPartialDownloadPath(download);
        deleteFile(fullpath);
        res = await new dispatch(makePartialRequest(id, download.url, 0));
        const filename = getFilename(download.url, res.headers);
        const size = getFileSize(res.headers);
        dispatch(
          changeDownloadBasicInfo(
            id,
            filename,
            await getAvailableFilename(download.dirname, filename, downloads),
            size,
            res.statusCode === 206
          )
        );
        download = getState().downloads.find(download => download.id === id);
        fullpath = getPartialDownloadPath(download);
        stream = fs.createWriteStream(fullpath);
        dispatch(updateBytesDownloaded(id, 0));
        // The download status might have changed since dispatching resumeDownload
        download = getState().downloads.find(download => download.id === id);
        if (download.status === 'started') {
          dispatch(resumeDownload(id, res));
          dispatch(thunkDownloadFile(id, res, stream));
        }
        break;
      case 'ECONNREFUSED':
        dispatch(thunkResumeDownload(id));
        return;
      default:
        break;
    }
    return Promise.resolve();
  };
}

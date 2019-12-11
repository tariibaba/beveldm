import {
  resumeDownload,
  downloadError,
  changeDownloadBasicInfo,
  setDownloadRes
} from '../actions';
import {
  getAvailableFilename,
  getPartialDownloadPath,
  deleteFile
} from './helpers';
import { getFilename, getFileSize } from './helpers';
import thunkDownloadFile from './download-file';
import makePartialRequest from './make-partial-request';
import thunkUpdateBytesDownloaded from './update-bytes-downloaded';

export default function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    dispatch(resumeDownload(id));

    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    if (download.res) {
      download.res.resume();
    } else if (download.status === 'error') {
      dispatch(thunkResumeFromError(id, download.error.code));
    } else {
      const res = await dispatch(
        makePartialRequest(id, download.url, download.bytesDownloaded)
      );
      dispatch(setDownloadRes(id, res));

      const filename = getFilename(download.url, res.headers);
      const contentLength = getFileSize(res.headers);
      let size;
      // Check for partial content
      if (download.resumable) {
        size = download.bytesDownloaded + contentLength;
      } else {
        size = contentLength;
      }

      if (download.filename !== filename || download.size !== size) {
        dispatch(downloadError(id, { code: 'ERR_FILE_CHANGED' }));
      } else {
        if (!download.resumable) {
          dispatch(thunkUpdateBytesDownloaded(id, 0));
        }

        // The download status might have changed since dispatching resumeDownload
        state = getState();
        download = state.downloads.find(download => download.id === id);
        if (download.status === 'started') {
          dispatch(thunkDownloadFile(id, res));
        }
      }
    }

    return Promise.resolve();
  };
}

function thunkResumeFromError(id, code) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    switch (code) {
      case 'ERR_FILE_CHANGED':
        let res;
        const fullpath = getPartialDownloadPath(download);
        deleteFile(fullpath);

        res = await new dispatch(makePartialRequest(id, download.url, 0));
        const filename = getFilename(download.url, res.headers);
        const size = getFileSize(res.headers);
        const availableFilename = getAvailableFilename(
          download.dirname,
          filename,
          state.downloads
        );

        dispatch(
          changeDownloadBasicInfo(
            id,
            filename,
            availableFilename,
            size,
            res.statusCode === 206
          )
        );
        dispatch(thunkUpdateBytesDownloaded(id, 0));

        // The download status might have changed since dispatching resumeDownload
        state = getState();
        download = state.downloads.find(download => download.id === id);
        if (download.status === 'started') {
          dispatch(resumeDownload(id, res));
          dispatch(thunkDownloadFile(id, res));
        }
        break;
      case 'ECONNRESET':
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
        dispatch(thunkResumeDownload(id));
        return;
      default:
        break;
    }

    return Promise.resolve();
  };
}

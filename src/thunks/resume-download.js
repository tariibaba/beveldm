import {
  changeDownloadBasicInfo,
  setDownloadRes,
  setDownloadError
} from '../actions';
import {
  getAvailableFilename,
  getPartialDownloadPath,
  deleteFile,
  getFilename,
  getFileSize
} from './utilities';
import downloadFile from './download-file';
import makePartialRequest from './make-partial-request';
import updateBytesDownloadedThunk from './update-bytes-downloaded';
import changeDownloadStatusThunk from './change-download-status';

export default function resumeDownload(id) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    if (download.res) {
      dispatch(changeDownloadStatusThunk(id, 'progressing'));
      download.res.resume();
    } else if (download.status === 'error') {
      dispatch(resumeFromError(id, download.error.code));
    } else {
      dispatch(changeDownloadStatusThunk(id, 'progressing'));
      const res = await dispatch(
        makePartialRequest(id, download.url, download.bytesDownloaded)
      );

      // The download status might have changed since making the request.
      state = getState();
      download = state.downloads.find(download => download.id === id);
      if (download.status !== 'progressing') {
        return;
      }

      dispatch(setDownloadRes(id, res));
      // Get info from the request.
      const filename = getFilename(download.url, res.headers);
      const contentLength = getFileSize(res.headers);
      let size;
      // Check for partial content.
      if (download.resumable) {
        size = download.bytesDownloaded + contentLength;
      } else {
        size = contentLength;
      }

      if (download.defaultFilename !== filename || download.size !== size) {
        dispatch(setDownloadError(id, { code: 'ERR_FILE_CHANGED' }));
        dispatch(changeDownloadStatusThunk(id, 'error'));
      } else {
        if (!download.resumable) {
          dispatch(updateBytesDownloadedThunk(id, 0));
        }
        dispatch(downloadFile(id, res));
      }
    }

    return Promise.resolve();
  };
}

function resumeFromError(id, code) {
  return async (dispatch, getState) => {
    dispatch(changeDownloadStatusThunk(id, 'progressing'));

    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    switch (code) {
      case 'ERR_FILE_CHANGED':
        let res;
        const fullpath = getPartialDownloadPath(download);
        deleteFile(fullpath);

        res = await new dispatch(makePartialRequest(id, download.url, 0));

        // The download status might have changed since making the request.
        state = getState();
        download = state.downloads.find(download => download.id === id);
        if (download.status !== 'progressing') {
          return;
        }

        dispatch(setDownloadRes(id, res));
        // Get info from the request.
        const filename = getFilename(download.url, res.headers);
        const size = getFileSize(res.headers);
        const availableFilename = await getAvailableFilename(
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
        dispatch(updateBytesDownloadedThunk(id, 0));
        dispatch(downloadFile(id, res));
        break;
      case 'ECONNRESET':
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
        dispatch(resumeDownload(id));
        return;
      default:
        break;
    }

    return Promise.resolve();
  };
}

import { setDownloadRes } from '../actions';
import { getFilename, getFileSize } from './utilities';
import downloadFile from './download-file';
import makeRequest from './make-request';
import changeDownloadStatusThunk from './change-download-status';
import setDownloadErrorThunk from './set-download-error';

export default function startDownload(id) {
  return async (dispatch, getState) => {
    dispatch(changeDownloadStatusThunk(id, 'progressing'));

    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    const res = await dispatch(makeRequest(id, download.url));

    // The download status might have changed since making the request.
    state = getState();
    download = state.downloads.find(download => download.id === id);

    if (download.status !== 'progressing') return;

    dispatch(setDownloadRes(id, res));
    // Get info from the request.
    const filename = getFilename(download.url, res.headers);
    const size = getFileSize(res.headers);

    if (download.defaultFilename !== filename || download.size !== size) {
      dispatch(setDownloadErrorThunk(id, { code: 'ERR_FILE_CHANGED' }));
    } else {
      dispatch(downloadFile(id, res));
    }

    return Promise.resolve();
  };
}

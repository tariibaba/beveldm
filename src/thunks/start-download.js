import { setDownloadRes, changeDownloadStatus, setDownloadError } from '../actions';
import { getFilename, getFileSize } from './helpers';
import downloadFile from './download-file';
import makeRequest from './make-request';

export default function startDownload(id) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.find(download => download.id === id);
    dispatch(changeDownloadStatus(id, 'progressing'));

    const res = await dispatch(makeRequest(id, download.url));

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

    if (download.defaultFilename !== filename || download.size !== size) {
      dispatch(setDownloadError(id, { code: 'ERR_FILE_CHANGED' }));
      dispatch(changeDownloadStatus(id, 'error'));
    } else {
      // The download status might have changed since dispatching startDownload
      download = getState().downloads.find(download => download.id === id);
      dispatch(downloadFile(id, res));
    }
  };
}

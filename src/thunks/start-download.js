import {
  setDownloadRes,
  downloadProgressing,
  showDownloadError
} from '../actions';
import { getFilename, getFileSize } from '../utilities';
import downloadFile from './download-file';
import makeRequest, { makeYouTubeRequest } from './make-request';

export default function startDownload(id) {
  return async (dispatch, getState) => {
    dispatch(downloadProgressing(id));

    let download = getState().downloads.find(download => download.id === id);

    let res;
    switch (download.type) {
      case 'file':
        res = await dispatch(makeRequest(id, download.url));

        // The download status might have changed since making the request.
        download = getState().downloads.find(download => download.id === id);
        if (download.status !== 'progressing') return;

        dispatch(setDownloadRes(id, res));
        const filename = getFilename(download.url, res.headers);
        const size = getFileSize(res.headers);
        if (download.defaultFilename !== filename || download.size !== size) {
          dispatch(showDownloadError(id, { code: 'EFILECHANGED' }));
        } else dispatch(downloadFile(id, res));
        break;
      case 'youtube':
        res = await dispatch(makeYouTubeRequest(id, download.url));
        dispatch(setDownloadRes(id, res));
        dispatch(downloadFile(id, res));
        break;
      default:
        break;
    }
    return Promise.resolve();
  };
}

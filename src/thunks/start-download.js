import { startDownload, downloadError, setDownloadRes } from '../actions';
import { getFilename, getFileSize } from './helpers';
import thunkDownloadFile from './download-file';
import makeRequest from './make-request';

export default function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    dispatch(startDownload(id));

    const res = await dispatch(makeRequest(id, download.url));
    dispatch(setDownloadRes(id, res));
    const filename = getFilename(download.url, res.headers);
    const size = getFileSize(res.headers);

    if (download.filename !== filename || download.size !== size)
      dispatch(downloadError(id, { code: 'ERR_FILE_CHANGED' }));
    else {
      // The download status might have changed since dispatching startDownload
      download = getState().downloads.find(download => download.id === id);
      if (download.status === 'started') {
        dispatch(thunkDownloadFile(id, res));
      }
    }
  };
}

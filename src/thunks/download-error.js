import { showDownloadError } from '../actions';
import { ipcRenderer } from 'electron';
import { getDownloadPath } from '../utilities';
import resumeDownload from './resume-download';

export default function (id, errorCode) {
  return async (dispatch, getState) => {
    let download = getState().downloads.byId[id];
    download.fileStream.close();
    if (
      [
        'EFILECHANGED',
        'EFORBIDDEN',
        'ERANGENOTSATISFIABLE',
        'HPE_INVALID_CONTENT_LENGTH',
      ].includes(errorCode)
    ) {
      dispatch(showDownloadError(id, errorCode));
      ipcRenderer.send('notify-fail', {
        code: errorCode,
        filePath: getDownloadPath(download),
      });
    } else {
      // Mutate object to prevent UI change
      download.status = 'error';
      download.error = { code: errorCode };
      download.res = null;
      download.fileStream = null;
      dispatch(resumeDownload(id));
    }
  };
}

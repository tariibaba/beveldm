import { showDownloadError } from '../actions';
import { ipcRenderer } from 'electron';
import { getDownloadPath } from '../utilities';
import resumeDownload from './resume-download';
import { DOWNLOAD_AUTO_RETRY_INTERVAL } from '../constants';

export default function (id, errorCode) {
  return async (dispatch, getState) => {
    const getDownload = () => getState().downloads.byId[id];
    if (getDownload().fileStream) getDownload().fileStream.close();
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
        filePath: getDownloadPath(getDownload()),
      });
    } else {
      // Mutate object to prevent UI change
      getState().downloads.byId[id] = {
        ...getDownload(),
        status: 'error',
        error: { code: errorCode, res: null, fileStream: null },
        autoretryTimeout: setTimeout(() => {
          dispatch(resumeDownload(id));
        }, DOWNLOAD_AUTO_RETRY_INTERVAL),
      };
    }
  };
}

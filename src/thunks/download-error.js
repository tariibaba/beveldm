import { showDownloadError } from '../actions';
import { ipcRenderer } from 'electron';
import { getDownloadPath } from '../utilities';
import resumeDownload from './resume-download';

export default function (id, error) {
  return async (dispatch, getState) => {
    let download = getState().downloads.byId[id];
    const { code } = error;
    if (['EFILECHANGED', 'EFORBIDDEN', 'ERANGENOTSATISFIABLE'].includes(code)) {
      dispatch(showDownloadError(id, error));
      ipcRenderer.send('notify-fail', {
        code,
        filePath: getDownloadPath(download),
      });
    } else {
      download.error = error; // Mutate object to prevent UI change
      download.res = null;
      dispatch(resumeDownload(id));
    }
  };
}

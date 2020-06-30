import { showDownloadError } from '../actions';
import { ipcRenderer } from 'electron';
import { getDownloadPath } from '../utilities';

export default function (id, error) {
  return (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    const { code } = error;
    dispatch(showDownloadError(id, error));
    if (['EFILECHANGED', 'EFORBIDDEN', 'ERANGENOTSATISFIABLE'].includes(code)) {
      ipcRenderer.send('notify-fail', {
        code,
        filePath: getDownloadPath(download),
      });
    }
  };
}

import changeDownloadStatusThunk from './change-download-status';
import { setDownloadError, setDownloadRes } from '../actions';

export default function setDownloadErrorThunk(id, error) {
  return dispatch => {
    dispatch(setDownloadError(id, { code: 'ERR_FILE_CHANGED' }));
    dispatch(changeDownloadStatusThunk(id, 'error'));
    dispatch(setDownloadRes(id, null));
  };
}

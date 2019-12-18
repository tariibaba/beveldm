import { changeDownloadStatus } from '../actions';
import { setTaskbarIconProgress } from './helpers';

export default function changeDownloadStatusThunk(id, status) {
  return async (dispatch, getState) => {
    dispatch(changeDownloadStatus(id, status));
    const downloads = getState().downloads;
    setTaskbarIconProgress(downloads);

    return Promise.resolve();
  };
}

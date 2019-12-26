import { changeDownloadStatus } from '../actions';
import { setTaskbarProgress } from '../utilities';

export default function changeDownloadStatusThunk(id, status) {
  return async (dispatch, getState) => {
    dispatch(changeDownloadStatus(id, status));
    const downloads = getState().downloads;
    setTaskbarProgress(downloads);

    return Promise.resolve();
  };
}

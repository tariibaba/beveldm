import { updateBytesDownloaded } from '../actions';
import thunkCompleteDownload from './complete-download';

export default function thunkUpdateBytesDownloaded(id, bytesDownloaded) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    dispatch(updateBytesDownloaded(id, bytesDownloaded));
    if (bytesDownloaded === download.size) {
      dispatch(thunkCompleteDownload(id));
    }

    return Promise.resolve();
  };
}

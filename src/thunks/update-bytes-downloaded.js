import { updateBytesDownloaded } from '../actions';
import completeDownload from './complete-download';

export default function updateBytesDownloadedThunk(id, bytesDownloaded) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    dispatch(updateBytesDownloaded(id, bytesDownloaded));
    if (bytesDownloaded === download.size) {
      dispatch(completeDownload(id));
    }

    return Promise.resolve();
  };
}

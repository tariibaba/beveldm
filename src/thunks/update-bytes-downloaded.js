import { updateBytesDownloaded } from '../actions';
import completeDownload from './complete-download';
import setTaskbarProgress from '../utilities/set-taskbar-progress';

export default function updateBytesDownloadedThunk(id, bytesDownloaded) {
  return async (dispatch, getState) => {
    dispatch(updateBytesDownloaded(id, bytesDownloaded));

    const state = getState();
    const download = state.downloads.find(download => download.id === id);

    if (bytesDownloaded === download.size) {
      dispatch(completeDownload(id));
    }

    setTaskbarProgress(state.downloads);

    return Promise.resolve();
  };
}

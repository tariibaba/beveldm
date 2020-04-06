import { pauseDownload } from '../actions';

export default function pauseDownloadThunk(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    if (download.type === 'file' || download.type === 'youtube') {
      if (download.res) download.res.pause();
    }
    dispatch(pauseDownload(id));
  };
}

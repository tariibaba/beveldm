import { pauseDownload } from '../actions';

export default function pauseDownloadThunk(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.type === 'file' || download.type === 'youtube') {
      download.res.pause();
    }
    dispatch(pauseDownload(id));

    return Promise.resolve();
  };
}

import { changeDownloadStatus } from '../actions';

export default function pauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.res) {
      download.res.pause();
    }
    dispatch(changeDownloadStatus(id, 'paused'))

    return Promise.resolve();
  };
}

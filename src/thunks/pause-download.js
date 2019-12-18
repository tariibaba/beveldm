import changeDownloadStatusThunk from './change-download-status';

export default function pauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.res) {
      download.res.pause();
    }
    dispatch(changeDownloadStatusThunk(id, 'paused'));

    return Promise.resolve();
  };
}

import { pauseDownload } from '../actions';

export function thunkPauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.status !== 'started') return;
    download.res.pause();
    dispatch(pauseDownload(id));
  };
}

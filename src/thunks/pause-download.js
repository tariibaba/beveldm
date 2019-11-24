import { pauseDownload } from '../actions';

export default function thunkPauseDownload(id) {
  return (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.res) download.res.pause();
    dispatch(pauseDownload(id));
    return Promise.resolve();
  };
}

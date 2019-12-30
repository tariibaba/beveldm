import { cancelDownload } from '../actions';

export default function cancelDownloadThunk(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.res) download.res.destroy();
    dispatch(cancelDownload(id));

    return Promise.resolve();
  };
}

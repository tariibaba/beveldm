import { cancelDownload, changeDownloadSpeed } from '../actions';

export default function cancelDownloadThunk(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.byId[id];
    if (download.res) download.res.destroy();
    download.fileStream.close();
    dispatch(cancelDownload(id));
    dispatch(changeDownloadSpeed(id, 0));
  };
}

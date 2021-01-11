import { cancelDownload, changeDownloadSpeed } from '../actions';
import { clearAutoretryTimeout } from './utils';

export default function cancelDownloadThunk(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.byId[id];
    if (download.res) download.res.destroy();
    if (download.fileStream) download.fileStream.close();
    clearAutoretryTimeout(download);
    dispatch(cancelDownload(id));
    dispatch(changeDownloadSpeed(id, 0));
  };
}

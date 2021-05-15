import { pauseDownload, changeDownloadSpeed } from '../actions';
import { clearAutoretryTimeout } from './utils';

export default function pauseDownloadThunk(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    if (download.type === 'file' || download.type === 'youtube') {
      if (download.res) download.res.destroy();
    }
    clearAutoretryTimeout(download);
    dispatch(pauseDownload(id));
    dispatch(changeDownloadSpeed(id, 0));
  };
}

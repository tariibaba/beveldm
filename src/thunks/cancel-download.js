import { setDownloadRes } from '../actions';
import changeDownloadStatusThunk from './change-download-status';

export default function cancelDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.res) download.res.destroy();
    dispatch(changeDownloadStatusThunk(id, 'canceled'));
    dispatch(setDownloadRes(id, undefined));
    
    return Promise.resolve();
  };
}

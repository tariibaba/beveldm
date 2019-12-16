import { changeDownloadStatus, setDownloadRes } from '../actions';

export default function cancelDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.res) download.res.destroy();
    dispatch(changeDownloadStatus(id, 'canceled'));
    dispatch(setDownloadRes(id, undefined));
    
    return Promise.resolve();
  };
}

import { setDownloadRes, downloadProgressing } from '../actions';
import { getFilename, getFileSize } from '../utilities';
import downloadFile from './download-file';
import downloadErrorThunk from './download-error';
import makeYouTubeRequest from './make-youtube-request';
import makePartialRequest from './make-partial-request';

export default function startDownload(id) {
  return async (dispatch, getState) => {
    dispatch(downloadProgressing(id));

    let download = getState().downloads.byId[id];

    let res;
    switch (download.type) {
      case 'file':
        res = await dispatch(makePartialRequest({ id, url: download.url }));

        // The download status might have changed since making the request.
        download = getState().downloads.byId[id];
        if (download.status !== 'progressing') return;

        dispatch(setDownloadRes(id, res));
        const filename = getFilename(download.url, res.headers);
        const size = getFileSize(res.headers);
        if (download.defaultFilename !== filename || download.size !== size) {
          dispatch(downloadErrorThunk(id, 'EFILECHANGED'));
        } else dispatch(downloadFile(id, res));
        break;
      case 'youtube':
        res = await dispatch(makeYouTubeRequest(id, download.url));
        dispatch(setDownloadRes(id, res));
        dispatch(downloadFile(id, res));
        break;
      default:
        break;
    }
  };
}

import {
  addNewDownload,
  changeDownloadBasicInfo,
  downloadNotStarted,
  updateBytesDownloaded,
  removeDownload,
  alert
} from '../actions';
import request from 'request';
import { getFilename, getFileSize, getAvailableFilename } from './helpers';
import { v4 } from 'uuid';

export default function thunkAddNewDownload(url, dirname) {
  return async (dispatch, getState) => {
    const downloads = getState().downloads;
    const id = v4();
    dispatch(addNewDownload(id, url, dirname));
    const res = await new Promise(async resolve =>
      request
        .get(url, { headers: { Range: 'bytes=0-' }})
        .on('response', res => resolve(res))
        .on('error', () => {
          dispatch(removeDownload(id));
          dispatch(
            alert(
              'Network error',
              'error',
              () => dispatch(thunkAddNewDownload(url, dirname)),
              'Retry'
            )
          );
        })
    );
    res.destroy();
    const filename = getFilename(url, res.headers);
    const size = getFileSize(res.headers);
    dispatch(
      changeDownloadBasicInfo(
        id,
        filename,
        await getAvailableFilename(dirname, filename, downloads),
        size,
        res.statusCode === 206
      )
    );
    dispatch(updateBytesDownloaded(id, 0));
    dispatch(downloadNotStarted(id));
  };
}

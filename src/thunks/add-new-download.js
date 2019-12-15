import {
  addNewDownload,
  changeDownloadBasicInfo,
  downloadNotStarted,
  removeDownload,
  notify
} from '../actions';
import request from 'request';
import { getFilename, getFileSize, getAvailableFilename } from './helpers';
import { v4 } from 'uuid';
import thunkUpdateBytesDownloaded from './update-bytes-downloaded';

export default function thunkAddNewDownload(url, dirname) {
  return async (dispatch, getState) => {
    let state = getState();
    let downloads = state.downloads;
    const id = v4();
    dispatch(addNewDownload(id, url, dirname));
    const res = await new Promise(async resolve =>
      request
        .get(url, { headers: { Range: 'bytes=0-' } })
        .on('response', res => resolve(res))
        .on('error', () => {
          dispatch(removeDownload(id));
          dispatch(
            notify('error', 'Network error', 'Retry', () =>
              dispatch(thunkAddNewDownload(url, dirname))
            )
          );
        })
    );
    res.destroy();
    if (res.statusCode === 403) {
      dispatch(removeDownload(id));
      dispatch(notify('error', 'Forbidden request'));
      return Promise.resolve();
    }

    // Get info from the request.
    const filename = getFilename(url, res.headers);
    const size = getFileSize(res.headers);

    state = getState();
    downloads = state.downloads;
    dispatch(
      changeDownloadBasicInfo(
        id,
        filename,
        await getAvailableFilename(dirname, filename, downloads),
        size,
        res.statusCode === 206
      )
    );
    dispatch(thunkUpdateBytesDownloaded(id, 0));
    dispatch(downloadNotStarted(id));

    return Promise.resolve();
  };
}

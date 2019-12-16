import {
  addNewDownload,
  changeDownloadBasicInfo,
  removeDownload,
  notify,
  changeDownloadStatus,
  setDownloadShow
} from '../actions';
import request from 'request';
import { getFilename, getFileSize, getAvailableFilename } from './helpers';
import { v4 } from 'uuid';
import updateBytesDownloadedThunk from './update-bytes-downloaded';

export default function addNewDownloadThunk(url, dirname) {
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
              dispatch(addNewDownloadThunk(url, dirname))
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
    dispatch(setDownloadShow(id, true));
    dispatch(updateBytesDownloadedThunk(id, 0));
    dispatch(changeDownloadStatus(id, 'notstarted'));

    return Promise.resolve();
  };
}

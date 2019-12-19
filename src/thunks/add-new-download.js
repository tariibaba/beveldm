import {
  addNewDownload,
  changeDownloadBasicInfo,
  removeDownload,
  notify,
  setDownloadShow
} from '../actions';
import request from 'request';
import {
  getFilename,
  getFileSize,
  getAvailableFilename,
  setTaskbarProgress
} from './helpers';
import { v4 } from 'uuid';
import updateBytesDownloadedThunk from './update-bytes-downloaded';
import changeDownloadStatusThunk from './change-download-status';

export default function addNewDownloadThunk(url, dirname) {
  return async (dispatch, getState) => {
    const id = v4();
    dispatch(addNewDownload(id, url, dirname));

    let state = getState();
    let downloads = state.downloads;
    setTaskbarProgress(downloads);

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
          
          state = getState();
          downloads = state.downloads;
          setTaskbarProgress(downloads);
        })
    );
    res.destroy();

    if (res.statusCode === 403) {
      dispatch(removeDownload(id));
      dispatch(notify('error', 'Forbidden request'));

      state = getState();
      downloads = state.downloads;
      setTaskbarProgress(downloads);

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
    dispatch(changeDownloadStatusThunk(id, 'notstarted'));

    state = getState();
    downloads = state.downloads;
    setTaskbarProgress(downloads);

    return Promise.resolve();
  };
}

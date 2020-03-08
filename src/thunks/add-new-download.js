import {
  addNewDownload,
  gotDownloadInfo,
  removeDownload,
  notify
} from '../actions';
import request from 'request';
import { getFilename, getFileSize, getAvailableFilename } from '../utilities';
import { v4 } from 'uuid';

export default function addNewDownloadThunk(url, dirname) {
  return async (dispatch, getState) => {
    const id = v4();
    dispatch(addNewDownload(id, 'file', url, dirname));

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

    dispatch(
      gotDownloadInfo(
        id,
        filename,
        await getAvailableFilename(dirname, filename, getState().downloads),
        size,
        res.statusCode === 206
      )
    );

    return Promise.resolve();
  };
}

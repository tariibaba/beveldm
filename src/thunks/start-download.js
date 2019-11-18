import fs from 'fs';
import { startingDownload, startDownload, downloadError } from '../actions';
import { httpGetPromise } from '../promisified';
import { getPartialDownloadPath } from './helpers';
import { getFilename, getFileSize } from './helpers';
import thunkDownloadFile from './download-file';

export default function thunkStartDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.status === 'starting') return;
    dispatch(startingDownload(id));

    const res = await httpGetPromise(download.url, {
      headers: {
        Range: 'bytes=0-',
        Connection: 'keep-alive'
      }
    });
    const filename = getFilename(download.url, res.headers);
    const size = getFileSize(res.headers);

    if (download.filename !== filename || download.size !== size)
      dispatch(downloadError(id, { code: 'ERR_FILE_CHANGED' }));
    else {
      dispatch(startDownload(id, res, res.statusCode === 206));
      const fullPath = getPartialDownloadPath(download);
      const stream = fs.createWriteStream(fullPath);
      dispatch(thunkDownloadFile(id, res, stream));
    }
  };
}

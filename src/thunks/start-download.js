import path from 'path';
import fs from 'fs';
import {
  startingDownload,
  startDownload,
  downloadError
} from '../actions';
import { httpGetPromise } from '../promisified';
import { replaceFileExt } from './helpers';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';
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

      const fullPath = path.resolve(
        download.dirname,
        replaceFileExt(download.filename, PARTIAL_DOWNLOAD_EXTENSION)
      );
      const stream = fs.createWriteStream(fullPath);
      dispatch(thunkDownloadFile(id, res, stream));
    }
  };
}

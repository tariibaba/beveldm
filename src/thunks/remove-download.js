import path from 'path';
import fs from 'fs';
import { removeDownload } from '../actions';
import { replaceFileExt } from './helpers';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';

export default function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const fullPath = path.resolve(download.dirname, download.filename);
    dispatch(removeDownload(id));
    if (download.status === 'canceled')
      fs.unlink(
        replaceFileExt(fullPath, PARTIAL_DOWNLOAD_EXTENSION),
        _err => {}
      );
  };
}

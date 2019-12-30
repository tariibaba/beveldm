import { getPartialDownloadPath, getDownloadPath } from '../utilities';
import pify from 'pify';
import fs from 'fs';
import { completeDownload } from '../actions';

export default function completeDownloadThunk(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    const rename = pify(fs.rename, { multiArgs: true });
    await rename(getPartialDownloadPath(download), getDownloadPath(download));
    dispatch(completeDownload(id));

    return Promise.resolve();
  };
}

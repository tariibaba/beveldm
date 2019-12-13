import { getPartialDownloadPath, getDownloadPath } from './helpers';
import pify from 'pify';
import { completeDownload } from '../actions';
import fs from 'fs';

export default function thunkCompleteDownload(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    const rename = pify(fs.rename, { multiArgs: true });
    await rename(getPartialDownloadPath(download), getDownloadPath(download));
    dispatch(completeDownload(id));

    return Promise.resolve();
  };
}

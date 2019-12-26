import { getPartialDownloadPath, getDownloadPath } from '../utilities';
import pify from 'pify';
import fs from 'fs';
import changeDownloadStatusThunk from './change-download-status';

export default function completeDownload(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    const rename = pify(fs.rename, { multiArgs: true });
    await rename(getPartialDownloadPath(download), getDownloadPath(download));
    dispatch(changeDownloadStatusThunk(id, 'complete'));

    return Promise.resolve();
  };
}

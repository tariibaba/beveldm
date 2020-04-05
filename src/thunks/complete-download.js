import { getPartialDownloadPath, getDownloadPath } from '../utilities';
import pify from 'pify';
import fs from 'fs';
import { completeDownload } from '../actions';
import open from 'open';

export default function completeDownloadThunk(id) {
  return async (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    const rename = pify(fs.rename, { multiArgs: true });
    const pathWhenCompleted = getDownloadPath(download);
    await rename(getPartialDownloadPath(download), pathWhenCompleted);
    dispatch(completeDownload(id));

    if (download.openWhenDone) open(pathWhenCompleted);
  };
}

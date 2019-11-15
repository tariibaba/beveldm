import path from 'path';
import fs from 'fs';
import thunkCompleteDownload from './complete-download';
import { startingDownload, startDownload, updateBytesDownloaded } from '../actions';
import { httpGetPromise } from '../promisified';
import { replaceFileExt } from './helpers';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';

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
    dispatch(startDownload(id, res, res.statusCode === 206));

    const fullPath = path.resolve(
      download.dirname,
      replaceFileExt(download.filename, PARTIAL_DOWNLOAD_EXTENSION)
    );
    const stream = fs.createWriteStream(fullPath);
    res
      .on('data', chunk => {
        res.pause();
        download = getState().downloads.find(download => download.id === id);
        stream.write(chunk, err => {
          if (err) throw err;
          const received = download.bytesDownloaded + chunk.length;
          dispatch(updateBytesDownloaded(id, received));
          if (received === download.size) dispatch(thunkCompleteDownload(id));
          if (download.status !== 'paused') res.resume();
        });
      })
      .on('end', () => {
        stream.close();
      });
  };
}

import { resumingDownload } from '../actions';
import { resumeDownload } from '../actions';
import { httpGetPromise } from '../promisified';
import path from 'path';
import { replaceFileExt } from './helpers';
import thunkCompleteDownload from './complete-download';
import fs from 'fs';
import { updateBytesDownloaded } from '../actions';
import { PARTIAL_DOWNLOAD_EXTENSION } from '../constants';

export default function thunkResumeDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    if (download.id === 'resuming') return;
    dispatch(resumingDownload(id));

    if (download.res) {
      download.res.resume();
      dispatch(resumeDownload(id, download.res));
    } else {
      let download = getState().downloads.find(download => download.id === id);

      const res = await httpGetPromise(download.url, {
        headers: {
          Range: `bytes=${download.bytesDownloaded}-`,
          Connection: 'keep-alive'
        }
      });
      dispatch(resumeDownload(id, res));

      const fullPath = path.resolve(
        download.dirname,
        replaceFileExt(download.filename, PARTIAL_DOWNLOAD_EXTENSION)
      );
      let stream;
      if (!download.resumable) {
        dispatch(updateBytesDownloaded(id, 0));
        stream = fs.createWriteStream(fullPath);
      } else stream = fs.createWriteStream(fullPath, { flags: 'a' });

      res
        .on('data', chunk => {
          res.pause();
          download = getState().downloads.find(download => download.id === id);
          console.log('bytesDownloaded: ' + download.bytesDownloaded);
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
    }
  };
}

import { updateBytesDownloaded } from '../actions';
import thunkCompleteDownload from './complete-download';
import fs from 'fs';
import { getPartialDownloadPath } from './helpers';

export default function thunkDownloadFile(id, res) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    const partialDownloadPath = getPartialDownloadPath(download);
    const fileStream = fs.createWriteStream(partialDownloadPath, {
      flags: 'a'
    });
    res
      .on('data', chunk => {
        res.pause();
        download = getState().downloads.find(download => download.id === id);
        fileStream.write(chunk, err => {
          if (err) throw err;
          const received = download.bytesDownloaded + chunk.length;
          dispatch(updateBytesDownloaded(id, received));
          if (received === download.size) dispatch(thunkCompleteDownload(id));
          if (download.status !== 'paused') res.resume();
        });
      })
      .on('end', () => {
        fileStream.close();
      });
  };
}

import updateBytesDownloadedThunk from './update-bytes-downloaded';
import fs from 'fs';
import { getPartialDownloadPath } from './utilities';
import { SAVE_DATA_LIMIT } from '../constants';
import Timeout from 'await-timeout';

export default function downloadFile(id, res) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    const partialDownloadPath = getPartialDownloadPath(download);
    const fileStream = fs.createWriteStream(partialDownloadPath, {
      flags: 'a'
    });
    const timeout = new Timeout();
    let buffer;

    res.on('data', async chunk => {
      res.pause();

      state = getState();
      download = state.downloads.find(download => download.id === id);
      let saveData = state.settings.saveData;

      if (!buffer) {
        buffer = chunk;
      } else {
        buffer = Buffer.concat([buffer, chunk]);
      }

      if (saveData) {
        const writeSlicedBuffer = async () => {
          await timeout.set(500);

          state = getState();
          download = state.downloads.find(download => download.id === id);
          if (download.status === 'paused') {
            return;
          }

          const chunkToWrite = buffer.slice(0, SAVE_DATA_LIMIT / 2);
          buffer = buffer.slice(SAVE_DATA_LIMIT / 2);

          await writeStreamWritePromise(fileStream, chunkToWrite);

          download = state.downloads.find(download => download.id === id);
          saveData = state.settings.saveData;

          const newBytesDownloaded =
            download.bytesDownloaded + chunkToWrite.length;
          dispatch(updateBytesDownloadedThunk(id, newBytesDownloaded));

          if (download.status !== 'paused') {
            if (buffer.length > SAVE_DATA_LIMIT && saveData) {
              writeSlicedBuffer();
            } else {
              res.resume();
            }
          }
        };
        await writeSlicedBuffer();
      } else {
        await writeStreamWritePromise(fileStream, buffer);

        const newBytesDownloaded = download.bytesDownloaded + buffer.length;
        dispatch(updateBytesDownloadedThunk(id, newBytesDownloaded));
        buffer = null;

        if (download.status !== 'paused') {
          res.resume();
        }
      }
    });

    res.on('end', () => {
      timeout.clear();
      fileStream.close();
    });
  };
}

function writeStreamWritePromise(writeStream, chunk) {
  return new Promise((resolve, reject) => {
    writeStream.write(chunk, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

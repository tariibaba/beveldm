import thunkUpdateBytesDownloaded from './update-bytes-downloaded';
import fs from 'fs';
import { getPartialDownloadPath } from './helpers';
import { SAVE_DATA_LIMIT } from '../constants';

export default function thunkDownloadFile(id, res) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.find(download => download.id === id);

    const partialDownloadPath = getPartialDownloadPath(download);
    const fileStream = fs.createWriteStream(partialDownloadPath, {
      flags: 'a'
    });
    let buffer;
    let speedThrottleTimeout;

    res
      .on('data', async chunk => {
        res.pause();

        state = getState();
        download = state.downloads.find(download => download.id === id);

        if (!buffer) {
          buffer = chunk;
        } else {
          buffer = Buffer.concat([buffer, chunk]);
        }

        const saveData = state.settings.saveData;
        if (saveData) {
          const writeSlicedBuffer = () => {
            state = getState();
            download = state.downloads.find(download => download.id === id);

            const chunkToWrite = buffer.slice(0, SAVE_DATA_LIMIT / 2);
            buffer = buffer.slice(SAVE_DATA_LIMIT / 2);

            clearTimeout(speedThrottleTimeout);
            speedThrottleTimeout = setTimeout(() => {
              fileStream.write(chunkToWrite, async err => {
                if (err) throw err;

                const received = download.bytesDownloaded + chunkToWrite.length;
                dispatch(thunkUpdateBytesDownloaded(id, received));

                state = getState();
                download = state.downloads.find(download => download.id === id);

                if (
                  buffer.length > SAVE_DATA_LIMIT / 2 &&
                  state.settings.saveData &&
                  download.status !== 'paused'
                ) {
                  writeSlicedBuffer();
                } else if (download.status !== 'paused') {
                  res.resume();
                }
              });
            }, 500);
          };
          await writeSlicedBuffer();
        } else {
          fileStream.write(buffer, err => {
            if (err) throw err;
            const received = download.bytesDownloaded + buffer.length;
            buffer = null;
            dispatch(thunkUpdateBytesDownloaded(id, received));

            if (download.status !== 'paused') res.resume();
          });
        }
      })
      .on('end', () => {
        clearTimeout(speedThrottleTimeout);
        fileStream.close();
      });
  };
}

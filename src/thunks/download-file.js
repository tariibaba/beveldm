import updateBytesDownloadedThunk from './update-bytes-downloaded';
import fs from 'fs';
import { getPartialDownloadPath } from '../utilities';
import { SAVE_DATA_LIMIT } from '../constants';
import Timeout from 'await-timeout';

export default function downloadFile(id, res) {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.downloads.byId[id];

    const partialDownloadPath = getPartialDownloadPath(download);
    const fileStream = fs.createWriteStream(
      partialDownloadPath,
      download.bytesDownloaded > 0 ? { flags: 'a' } : undefined
    );
    const timeout = new Timeout();
    let buffer;
    let hasResEnded = false;
    let firstTimeoutRunning = false;
    let firstTimeoutElapsed = false;
    const firstSaveDataTimeout = new Timeout();

    res.on('data', async (chunk) => {
      res.pause();

      state = getState();
      download = state.downloads.byId[id];
      let saveData = state.settings.saveData;

      buffer = buffer ? Buffer.concat([buffer, chunk]) : chunk;

      if (saveData) {
        let shouldSkipSecondTimeout = false;

        const writeSlicedBuffer = async () => {
          if (shouldSkipSecondTimeout) shouldSkipSecondTimeout = false;
          else await timeout.set(500);

          state = getState();
          download = state.downloads.byId[id];

          if (['paused', 'canceled', 'complete'].includes(download.status)) {
            return;
          }

          const chunkToWrite = buffer.slice(0, SAVE_DATA_LIMIT / 2);
          buffer = buffer.slice(SAVE_DATA_LIMIT / 2);
          await writeStreamWritePromise(fileStream, chunkToWrite);
          await dispatch(
            updateBytesDownloadedThunk(
              id,
              download.bytesDownloaded + chunkToWrite.length
            )
          );

          state = getState();
          download = state.downloads.byId[id];
          saveData = state.settings.saveData;

          if (download.status !== 'paused' && download.status !== 'canceled') {
            if ((buffer.length > SAVE_DATA_LIMIT && saveData) || hasResEnded) {
              await writeSlicedBuffer();
            } else res.resume();
          }
        };

        // Keep adding more data to buffer until length is more than half of
        // SAVE_DATA_LIMIT or timeout has elapsed.
        if (!firstTimeoutRunning) {
          firstTimeoutElapsed = false;
          firstTimeoutRunning = true;
          firstSaveDataTimeout.set(500).then(async () => {
            firstTimeoutElapsed = true;
            firstTimeoutRunning = false;
            shouldSkipSecondTimeout = true;
            res.pause();
            saveData = state.settings.saveData;
            if (saveData) await writeSlicedBuffer();
          });
        }
        if (!firstTimeoutElapsed) {
          if (buffer.length < SAVE_DATA_LIMIT / 2) res.resume();
          else {
            firstTimeoutRunning = false;
            firstSaveDataTimeout.clear();
            res.pause();
            await writeSlicedBuffer();
          }
        }
      } else {
        await writeStreamWritePromise(fileStream, buffer);
        await dispatch(
          updateBytesDownloadedThunk(
            id,
            download.bytesDownloaded + buffer.length
          )
        );
        buffer = null;

        if (download.status !== 'paused') res.resume();
      }

      if (hasResEnded) fileStream.close();
    });

    res.on('end', () => {
      hasResEnded = true;
    });
  };
}

function writeStreamWritePromise(writeStream, chunk) {
  return new Promise((resolve, reject) => {
    writeStream.write(chunk, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

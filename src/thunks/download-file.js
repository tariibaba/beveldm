import updateBytesDownloadedThunk from './update-bytes-downloaded';
import fs from 'fs';
import { getPartialDownloadPath } from '../utilities';
import { SAVE_DATA_LIMIT } from '../constants';
import Timeout from 'await-timeout';
import { setDownloadFileStream } from '../actions/downloads';

export default function downloadFile(id) {
  return new FileDownloader(id).download();
}

class FileDownloader {
  constructor(downloadId) {
    this.downloadId = downloadId;
    this.writeBufferTimeout = new Timeout();
    this.limitSpeedTimeout = new TimeoutWithInfo();
    this.shouldSkipWriteBufferTimeout = false;
  }

  download() {
    return async (dispatch, getState) => {
      this.getState = getState;
      this.dispatch = dispatch;
      this.res = this._getDownload().res;
      this._createFileStream();
      this._listenToResDataEvent();
    };
  }

  _getDownload() {
    return this.getState().downloads.byId[this.downloadId];
  }

  _listenToResDataEvent() {
    this.res.on('data', (chunk) => {
      this.res.pause();
      if (!this._shouldStopDownload()) {
        this._addDataToBuffer(chunk);
        this._writeBuffer();
      }
    });
  }

  _writeBuffer() {
    if (this._getSpeedLimit()) {
      this._limitDataWrittenToBufferWithSpeedLimit();
    } else this._writeBufferWithNoSpeedLimit();
  }

  _createFileStream() {
    const download = this._getDownload();
    const partialDownloadPath = getPartialDownloadPath(download);
    const { bytesDownloaded } = download;
    const options = bytesDownloaded > 0 ? { flags: 'a' } : undefined;
    this.fileStream = fs.createWriteStream(partialDownloadPath, options);
    this.dispatch(setDownloadFileStream(this.downloadId, this.fileStream));
  }

  _addDataToBuffer(data) {
    this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;
  }

  _getSpeedLimit() {
    const settings = this.getState().settings;
    return (
      (settings.saveData && SAVE_DATA_LIMIT) ||
      (this._getDownload().limitSpeed && settings.downloadSpeedLimit)
    );
  }

  async _writeBufferWithSpeedLimit() {
    do {
      await this._waitForWriteBufferTimeout();
      if (!this._shouldStopDownload()) {
        const chunk = this._sliceChunkFromBuffer();
        await this._writeDataToStream(chunk);
      }
    } while (this._shouldContinueToWriteBufferWithSpeedLimit());
    if (!this._shouldStopDownload()) this.res.resume();
  }

  async _waitForWriteBufferTimeout() {
    if (!this._shouldSkipWriteBufferTimeout()) {
      const timeoutDuration = this.constructor.TIMEOUT_DURATION;
      await this.writeBufferTimeout.set(timeoutDuration);
    }
  }

  async _writeBufferWithNoSpeedLimit() {
    await this._writeDataToStream(this.buffer);
    this._clearBuffer();
    if (!this._shouldStopDownload()) this.res.resume();
  }

  _shouldStopDownload() {
    const status = this._getDownload().status;
    return (
      ['paused', 'canceled', 'complete'].includes(status) ||
      this.fileStream.destroyed
    );
  }

  _shouldContinueToWriteBufferWithSpeedLimit() {
    return this._getSpeedLimit() && this._isBufferAboveSpeedLimit();
  }

  _limitDataWrittenToBufferWithSpeedLimit() {
    this._setLimitSpeedTimeout();
    this._checkIfFirstSaveDataTimeoutDidElapse();
  }

  async _setLimitSpeedTimeout() {
    if (!this.limitSpeedTimeout.isSet) {
      await this.limitSpeedTimeout.set(500);
      this.res.pause();
      this._skipWriteBufferTimeout();
      if (this._getSpeedLimit()) await this._writeBufferWithSpeedLimit();
      else await this._writeBufferWithNoSpeedLimit();
    }
  }

  _skipWriteBufferTimeout() {
    this.shouldSkipWriteBufferTimeout = true;
  }

  async _checkIfFirstSaveDataTimeoutDidElapse() {
    if (!this.limitSpeedTimeout.didElapse) {
      if (!this._isBufferAboveSpeedLimit() && !this._shouldStopDownload()) {
        this.res.resume();
      } else {
        await this.limitSpeedTimeout.clear();
        this.res.pause();
        await this._writeBufferWithSpeedLimit();
      }
    }
  }

  _isBufferAboveSpeedLimit() {
    const timeoutDuration = this.constructor.TIMEOUT_DURATION;
    const speedFactor = timeoutDuration / 1000;
    const bufferLimit = this._getSpeedLimit() * speedFactor;
    return this.buffer.length > bufferLimit;
  }

  _sliceChunkFromBuffer() {
    const speedLimit = this._getSpeedLimit();
    const chunk = this.buffer.slice(0, speedLimit / 2);
    this.buffer = this.buffer.slice(speedLimit / 2);
    return chunk;
  }

  _shouldSkipWriteBufferTimeout() {
    const formerValue = this.shouldSkipWriteBufferTimeout;
    this.shouldSkipWriteBufferTimeout = false;
    return formerValue;
  }

  async _writeDataToStream(data) {
    await writeStreamWritePromise(this.fileStream, data);
    const newBytesDownloaded = this._getNewBytesDownloaded(data);
    await this._updateBytesDownloaded(newBytesDownloaded);
  }

  _clearBuffer() {
    this.buffer = null;
  }

  async _updateBytesDownloaded(newBytesDownloaded) {
    await this.dispatch(
      updateBytesDownloadedThunk(this.downloadId, newBytesDownloaded)
    );
  }

  _getNewBytesDownloaded(newData) {
    return this._getDownload().bytesDownloaded + newData.length;
  }
}

FileDownloader.TIMEOUT_DURATION = 500;

class TimeoutWithInfo {
  constructor() {
    this.timeout = new Timeout();
    this._isSet = false;
    this._didElapse = false;
  }

  async set(delay) {
    this._isSet = true;
    await this.timeout.set(delay);
    this._isSet = false;
    this._didElapse = true;
  }

  async clear() {
    await this.timeout.clear();
    this._isSet = false;
  }

  get isSet() {
    return this._isSet;
  }

  get didElapse() {
    return this._didElapse;
  }
}

function writeStreamWritePromise(writeStream, chunk) {
  return new Promise((resolve, reject) => {
    writeStream.write(chunk, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

import { v4 } from 'uuid';
import { resolve } from 'path';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
const START_DOWNLOAD = 'START_DOWNLOAD';
const UPDATE_BYTES_DOWNLOADED = 'UPDATE_BYTES_DOWNLOADED';

const C = { ADD_NEW_DOWNLOAD, START_DOWNLOAD, UPDATE_BYTES_DOWNLOADED };

export function addNewDownload(url, filename, size) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id: v4(),
    url,
    filename,
    dirname: resolve('downloads'),
    size,
    status: 'notstarted',
    bytesDownloaded: 0
  };
}

export function startDownload(id, res) {
  return {
    type: START_DOWNLOAD,
    id,
    res,
    status: 'started'
  };
}

export function updateBytesDownloaded(id, bytesDownloaded) {
  return {
    type: UPDATE_BYTES_DOWNLOADED,
    id,
    bytesDownloaded
  };
}

export default C;

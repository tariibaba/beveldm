import { v4 } from 'uuid';
import { resolve } from 'path';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
const START_DOWNLOAD = 'START_DOWNLOAD';
const UPDATE_BYTES_DOWNLOADED = 'UPDATE_BYTES_DOWNLOADED';
const PAUSE_DOWNLOAD = 'PAUSE_DOWNLOAD';
const RESUME_DOWNLOAD = 'RESUME_DOWNLOAD';
const COMPLETE_DOWNLOAD = 'COMPLETE_DOWNLOAD';

const C = {
  ADD_NEW_DOWNLOAD,
  START_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
  PAUSE_DOWNLOAD,
  RESUME_DOWNLOAD,
  COMPLETE_DOWNLOAD
};

export function addNewDownload(url, dirname, filename, size) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id: v4(),
    url,
    filename,
    dirname,
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
    status: 'started',
  };
}

export function updateBytesDownloaded(id, bytesDownloaded) {
  return {
    type: UPDATE_BYTES_DOWNLOADED,
    id,
    bytesDownloaded
  };
}

export function pauseDownload(id) {
  return {
    type: PAUSE_DOWNLOAD,
    id,
    status: 'paused'
  };
}

export function resumeDownload(id, res) {
  return {
    type: RESUME_DOWNLOAD,
    id,
    res,
    status: 'started'
  }
}

export function completeDownload(id) {
  return {
    type: COMPLETE_DOWNLOAD,
    id,
    status: 'complete'
  };
}

export default C;

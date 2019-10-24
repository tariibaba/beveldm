import { v4 } from 'uuid';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
const START_DOWNLOAD = 'START_DOWNLOAD';
const UPDATE_BYTES_DOWNLOADED = 'UPDATE_BYTES_DOWNLOADED';
const PAUSE_DOWNLOAD = 'PAUSE_DOWNLOAD';
const RESUME_DOWNLOAD = 'RESUME_DOWNLOAD';
const COMPLETE_DOWNLOAD = 'COMPLETE_DOWNLOAD';
const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';
const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD';
const SET_INTERVAL = 'SET_INTERVAL';
const CLEAR_INTERVAL = 'CLEAR_INTERVAL';
const SUBSCRIBE_TO_INTERVAL = 'SUBSCRIBE_TO_INTERVAL';
const UNSUBSCRIBE_FROM_INTERVAL = 'UNSUBSCRIBE_FROM_INTERVAL';

const C = {
  ADD_NEW_DOWNLOAD,
  START_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
  PAUSE_DOWNLOAD,
  RESUME_DOWNLOAD,
  COMPLETE_DOWNLOAD,
  CANCEL_DOWNLOAD,
  REMOVE_DOWNLOAD,
  SET_INTERVAL,
  CLEAR_INTERVAL,
  SUBSCRIBE_TO_INTERVAL,
  UNSUBSCRIBE_FROM_INTERVAL
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

export function startDownload(id, res, resumable) {
  return {
    type: START_DOWNLOAD,
    id,
    res,
    status: 'started',
    resumable
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
  };
}

export function completeDownload(id) {
  return {
    type: COMPLETE_DOWNLOAD,
    id,
    status: 'complete'
  };
}

export function cancelDownload(id) {
  return {
    type: CANCEL_DOWNLOAD,
    id,
    status: 'canceled'
  };
}

export function removeDownload(id) {
  return {
    type: REMOVE_DOWNLOAD,
    id
  };
}

export function setDownloadInterval(interval) {
  return {
    type: SET_INTERVAL,
    interval
  };
}

export function subscribeToInterval(id, action) {
  return {
    type: SUBSCRIBE_TO_INTERVAL,
    id,
    action
  };
}

export function unsubscribeFromInterval(id) {
  return {
    type: UNSUBSCRIBE_FROM_INTERVAL,
    id
  };
}

export default C;

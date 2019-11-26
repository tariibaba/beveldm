import { v4 } from 'uuid';

const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
const DOWNLOAD_NOT_STARTED = 'DOWNLOAD_NOT_STARTED';
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
const CHANGE_DOWNLOAD_URL = 'CHANGE_DOWNLOAD_URL';
const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
const CHANGE_DOWNLOAD_BASIC_INFO = 'CHANGE_DOWNLOAD_BASIC_INFO';
const DOWNLOAD_REMOVED = 'DOWNLOAD_REMOVED';
const HIDE_DOWNLOAD = 'HIDE_DOWNLOAD';
const SHOW_DOWNLOAD = 'SHOW_DOWNLOAD';
const ALERT = 'ALERT';

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
  UNSUBSCRIBE_FROM_INTERVAL,
  CHANGE_DOWNLOAD_URL,
  DOWNLOAD_ERROR,
  CHANGE_DOWNLOAD_BASIC_INFO,
  DOWNLOAD_REMOVED,
  DOWNLOAD_NOT_STARTED,
  HIDE_DOWNLOAD,
  SHOW_DOWNLOAD,
  ALERT
};

export function addNewDownload(
  id,
  url,
  dirname
) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id,
    url,
    dirname,
    status: 'gettinginfo'
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
    status: 'canceled',
    res: undefined
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

export function changeDownloadUrl(id, newUrl) {
  return {
    type: CHANGE_DOWNLOAD_URL,
    id,
    newUrl,
    res: undefined
  };
}

export function changeDownloadBasicInfo(id, filename, availableFilename, size) {
  return {
    type: CHANGE_DOWNLOAD_BASIC_INFO,
    id,
    filename,
    availableFilename,
    size
  };
}

export function downloadError(id, error) {
  return {
    type: DOWNLOAD_ERROR,
    id,
    status: 'error',
    error
  };
}

export function downloadRemoved(id) {
  return {
    type: DOWNLOAD_REMOVED,
    id,
    status: 'deleted'
  };
}

export function downloadNotStarted(id) {
  return {
    type: DOWNLOAD_NOT_STARTED,
    id,
    status: 'notstarted',
    show: true
  };
}

export function hideDownload(id) {
  return {
    type: HIDE_DOWNLOAD,
    id,
    show: false
  };
}

export function showDownload(id) {
  return {
    type: SHOW_DOWNLOAD,
    id,
    show: true
  };
}

export function alert(message, messageType, action, actionName) {
  return {
    type: ALERT,
    message,
    messageType,
    action,
    actionName
  };
}

export default C;

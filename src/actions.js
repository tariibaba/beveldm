export const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
export const DOWNLOAD_NOT_STARTED = 'DOWNLOAD_NOT_STARTED';
export const START_DOWNLOAD = 'START_DOWNLOAD';
export const UPDATE_BYTES_DOWNLOADED = 'UPDATE_BYTES_DOWNLOADED';
export const PAUSE_DOWNLOAD = 'PAUSE_DOWNLOAD';
export const RESUME_DOWNLOAD = 'RESUME_DOWNLOAD';
export const COMPLETE_DOWNLOAD = 'COMPLETE_DOWNLOAD';
export const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD';
export const SET_DOWNLOAD_RES = 'SET_DOWNLOAD_RES';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SUBSCRIBE_TO_INTERVAL = 'SUBSCRIBE_TO_INTERVAL';
export const UNSUBSCRIBE_FROM_INTERVAL = 'UNSUBSCRIBE_FROM_INTERVAL';
export const CHANGE_DOWNLOAD_URL = 'CHANGE_DOWNLOAD_URL';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const CHANGE_DOWNLOAD_BASIC_INFO = 'CHANGE_DOWNLOAD_BASIC_INFO';
export const DOWNLOAD_REMOVED = 'DOWNLOAD_REMOVED';
export const HIDE_DOWNLOAD = 'HIDE_DOWNLOAD';
export const SHOW_DOWNLOAD = 'SHOW_DOWNLOAD';
export const ALERT = 'ALERT';
export const TOGGLE_SAVE_DATA = 'TOGGLE_SAVE_DATA';

export function addNewDownload(id, url, dirname) {
  return {
    type: ADD_NEW_DOWNLOAD,
    id,
    url,
    dirname,
    status: 'gettinginfo'
  };
}

export function startDownload(id, res) {
  return {
    type: START_DOWNLOAD,
    id,
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

export function pauseDownload(id) {
  return {
    type: PAUSE_DOWNLOAD,
    id,
    status: 'paused'
  };
}

export function resumeDownload(id) {
  return {
    type: RESUME_DOWNLOAD,
    id,
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

export function setDownloadRes(id, res) {
  return {
    type: SET_DOWNLOAD_RES,
    id,
    res
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

export function changeDownloadBasicInfo(
  id,
  filename,
  availableFilename,
  size,
  resumable
) {
  return {
    type: CHANGE_DOWNLOAD_BASIC_INFO,
    id,
    filename,
    availableFilename,
    size,
    resumable
  };
}

export function downloadError(id, error) {
  return {
    type: DOWNLOAD_ERROR,
    id,
    status: 'error',
    error,
    res: undefined
  };
}

export function downloadRemoved(id) {
  return {
    type: DOWNLOAD_REMOVED,
    id,
    status: 'removed'
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

export function toggleSaveData(value) {
  return {
    type: TOGGLE_SAVE_DATA,
    value
  };
}

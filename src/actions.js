export const ADD_NEW_DOWNLOAD = 'ADD_NEW_DOWNLOAD';
export const UPDATE_BYTES_DOWNLOADED = 'UPDATE_BYTES_DOWNLOADED';
export const REMOVE_DOWNLOAD = 'REMOVE_DOWNLOAD';
export const SET_DOWNLOAD_RES = 'SET_DOWNLOAD_RES';
export const SET_INTERVAL = 'SET_INTERVAL';
export const SUBSCRIBE_TO_INTERVAL = 'SUBSCRIBE_TO_INTERVAL';
export const UNSUBSCRIBE_FROM_INTERVAL = 'UNSUBSCRIBE_FROM_INTERVAL';
export const CHANGE_DOWNLOAD_URL = 'CHANGE_DOWNLOAD_URL';
export const CHANGE_DOWNLOAD_BASIC_INFO = 'CHANGE_DOWNLOAD_BASIC_INFO';
export const CHANGE_DOWNLOAD_STATUS = 'CHANGE_DOWNLOAD_STATUS';
export const DOWNLOAD_REMOVED = 'DOWNLOAD_REMOVED';
export const SET_DOWNLOAD_ERROR = 'SET_DOWNLOAD_ERROR';
export const SET_DOWNLOAD_SHOW = 'SET_DOWNLOAD_VISIBILITY';
export const NOTIFY = 'NOTIFY';
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

export function updateBytesDownloaded(id, bytesDownloaded) {
  return {
    type: UPDATE_BYTES_DOWNLOADED,
    id,
    bytesDownloaded
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
  defaultFilename,
  availableFilename,
  size,
  resumable
) {
  return {
    type: CHANGE_DOWNLOAD_BASIC_INFO,
    id,
    defaultFilename,
    availableFilename,
    size,
    resumable
  };
}

export function changeDownloadStatus(id, status) {
  return {
    type: CHANGE_DOWNLOAD_STATUS,
    id,
    status
  };
}

export function setDownloadError(id, error) {
  return {
    type: SET_DOWNLOAD_ERROR,
    id,
    error: error
  };
}

export function setDownloadShow(id, show) {
  return {
    type: SET_DOWNLOAD_SHOW,
    id,
    show
  }
}

export function notify(variant, message, actionName, action) {
  console.log('notify');
  return {
    type: NOTIFY,
    variant,
    message,
    actionName,
    action
  };
}

export function toggleSaveData(value) {
  return {
    type: TOGGLE_SAVE_DATA,
    value
  };
}

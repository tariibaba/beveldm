import {
  ADD_NEW_DOWNLOAD,
  REMOVE_DOWNLOAD,
  CHANGE_DOWNLOAD_INFO,
  CHANGE_DOWNLOAD_URL,
  SET_DOWNLOAD_RES,
  SHOW_DOWNLOAD,
  HIDE_DOWNLOAD,
  GOT_DOWNLOAD_INFO,
  DOWNLOAD_PROGRESSING,
  PAUSE_DOWNLOAD,
  CANCEL_DOWNLOAD,
  SHOW_DOWNLOAD_ERROR,
  DOWNLOAD_FILE_REMOVED,
  COMPLETE_DOWNLOAD,
  TOGGLE_OPEN_WHEN_DONE,
  CHANGE_DOWNLOAD_SPEED,
  UPDATE_BYTES_DOWNLOADED_SHOWN,
  CHOSEN_YOUTUBE_FORMAT,
} from './constants';

export function addNewDownload(id, dtype, url) {
  return {
    type: ADD_NEW_DOWNLOAD,
    dtype,
    id,
    url,
    status: 'gettinginfo',
  };
}

export function removeDownload(id) {
  return {
    type: REMOVE_DOWNLOAD,
    id,
  };
}

export function changeDownloadUrl(id, url) {
  return {
    type: CHANGE_DOWNLOAD_URL,
    id,
    url,
    res: undefined,
  };
}

export function changeDownloadInfo({
  id,
  defaultFilename,
  availableFilename,
  size,
  resumable
}) {
  return {
    type: CHANGE_DOWNLOAD_INFO,
    id,
    defaultFilename,
    availableFilename,
    size,
    resumable,
  };
}

export function showDownload(id) {
  return {
    type: SHOW_DOWNLOAD,
    id,
    show: true,
  };
}

export function hideDownload(id) {
  return {
    type: HIDE_DOWNLOAD,
    id,
    show: false,
  };
}

export function setDownloadRes(id, res) {
  return {
    type: SET_DOWNLOAD_RES,
    id,
    res,
  };
}

export function gotDownloadInfo({
  id,
  dirname,
  defaultFilename,
  availableFilename,
  size,
  resumable,
  openWhenDone,
  timestamp
}) {
  return {
    type: GOT_DOWNLOAD_INFO,
    id,
    dirname,
    defaultFilename,
    availableFilename,
    speed: 0,
    bytesDownloaded: 0,
    bytesDownloadedShown: 0,
    size,
    resumable,
    status: 'notstarted',
    show: true,
    timestamp,
    openWhenDone,
  };
}

export function downloadProgressing(id) {
  return {
    type: DOWNLOAD_PROGRESSING,
    id,
    status: 'progressing',
  };
}

export function pauseDownload(id) {
  return {
    type: PAUSE_DOWNLOAD,
    id,
    status: 'paused',
  };
}

export function cancelDownload(id) {
  return {
    type: CANCEL_DOWNLOAD,
    id,
    res: undefined,
    status: 'canceled',
  };
}

export function downloadFileRemoved(id) {
  return {
    type: DOWNLOAD_FILE_REMOVED,
    id,
    status: 'removed',
  };
}

export function completeDownload(id) {
  return {
    type: COMPLETE_DOWNLOAD,
    id,
    status: 'complete',
  };
}

export function showDownloadError(id, errorCode) {
  return {
    type: SHOW_DOWNLOAD_ERROR,
    id,
    res: undefined,
    status: 'error',
    error: { code: errorCode },
  };
}

export function toggleOpenWhenDone(id, value) {
  return {
    type: TOGGLE_OPEN_WHEN_DONE,
    id,
    value,
  };
}

export function changeDownloadSpeed(id, speed) {
  return {
    type: CHANGE_DOWNLOAD_SPEED,
    id,
    speed,
  };
}

export function updateBytesDownloadedShown(id, bytesDownloadedShown) {
  return {
    type: UPDATE_BYTES_DOWNLOADED_SHOWN,
    id,
    bytesDownloadedShown,
  };
}

export function chosenYouTubeFormat({
  id,
  dirname,
  defaultFilename,
  availableFilename,
  size,
  format,
  openWhenDone,
  timestamp
}) {
  return {
    type: CHOSEN_YOUTUBE_FORMAT,
    id,
    dirname,
    defaultFilename,
    availableFilename,
    size,
    format,
    speed: 0,
    bytesDownloaded: 0,
    bytesDownloadedShown: 0,
    status: 'notstarted',
    show: true,
    resumable: true,
    timestamp,
    openWhenDone,
  };
}

import {
  ADD_NEW_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
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
  COMPLETE_DOWNLOAD
} from './constants';

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

export function changeDownloadUrl(id, url) {
  return {
    type: CHANGE_DOWNLOAD_URL,
    id,
    url,
    res: undefined
  };
}

export function changeDownloadInfo(
  id,
  defaultFilename,
  availableFilename,
  size,
  resumable
) {
  return {
    type: CHANGE_DOWNLOAD_INFO,
    id,
    defaultFilename,
    availableFilename,
    size,
    resumable
  };
}

export function showDownload(id) {
  return {
    type: SHOW_DOWNLOAD,
    id,
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

export function setDownloadRes(id, res) {
  return {
    type: SET_DOWNLOAD_RES,
    id,
    res
  };
}

export function gotDownloadInfo(
  id,
  defaultFilename,
  availableFilename,
  size,
  resumable
) {
  return {
    type: GOT_DOWNLOAD_INFO,
    id,
    defaultFilename,
    availableFilename,
    bytesDownloaded: 0,
    size,
    resumable,
    status: 'notstarted',
    show: true
  };
}

export function downloadProgressing(id) {
  return {
    type: DOWNLOAD_PROGRESSING,
    id,
    status: 'progressing'
  };
}

export function pauseDownload(id) {
  return {
    type: PAUSE_DOWNLOAD,
    id,
    status: 'paused'
  };
}

export function cancelDownload(id) {
  return {
    type: CANCEL_DOWNLOAD,
    id,
    res: undefined,
    status: 'canceled'
  };
}

export function downloadFileRemoved(id) {
  return {
    type: DOWNLOAD_FILE_REMOVED,
    id,
    status: 'removed'
  };
}

export function completeDownload(id) {
  return {
    type: COMPLETE_DOWNLOAD,
    id,
    status: 'complete'
  }
}

export function showDownloadError(id, error) {
  return {
    type: SHOW_DOWNLOAD_ERROR,
    id,
    res: undefined,
    status: 'error',
    error
  };
}

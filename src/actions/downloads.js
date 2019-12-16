import {
  ADD_NEW_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
  REMOVE_DOWNLOAD,
  CHANGE_DOWNLOAD_BASIC_INFO,
  CHANGE_DOWNLOAD_URL,
  CHANGE_DOWNLOAD_STATUS,
  SET_DOWNLOAD_ERROR,
  SET_DOWNLOAD_SHOW,
  SET_DOWNLOAD_RES
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
  };
}

export function setDownloadRes(id, res) {
  return {
    type: SET_DOWNLOAD_RES,
    id,
    res
  };
}



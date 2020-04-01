import { updateObject, updateItemInArray, createReducer } from './utilities';
import {
  ADD_NEW_DOWNLOAD,
  REMOVE_DOWNLOAD,
  CHANGE_DOWNLOAD_URL,
  SET_DOWNLOAD_RES,
  SHOW_DOWNLOAD,
  HIDE_DOWNLOAD,
  DOWNLOAD_PROGRESSING,
  PAUSE_DOWNLOAD,
  CANCEL_DOWNLOAD,
  COMPLETE_DOWNLOAD,
  CHANGE_DOWNLOAD_INFO,
  GOT_DOWNLOAD_INFO,
  SHOW_DOWNLOAD_ERROR,
  DOWNLOAD_FILE_REMOVED,
  TOGGLE_OPEN_WHEN_DONE,
  CHANGE_DOWNLOAD_SPEED,
  UPDATE_BYTES_DOWNLOADED_SHOWN,
  CHOSEN_YOUTUBE_FORMAT
} from '../actions';

export default createReducer([], {
  [ADD_NEW_DOWNLOAD]: addNewDownload,
  [REMOVE_DOWNLOAD]: removeDownload,
  [CHANGE_DOWNLOAD_URL]: changeDownloadUrl,
  [SET_DOWNLOAD_RES]: setDownloadRes,
  [SHOW_DOWNLOAD]: setDownloadShow,
  [HIDE_DOWNLOAD]: setDownloadShow,
  [DOWNLOAD_PROGRESSING]: changeDownloadStatus,
  [PAUSE_DOWNLOAD]: changeDownloadStatus,
  [COMPLETE_DOWNLOAD]: changeDownloadStatus,
  [DOWNLOAD_FILE_REMOVED]: changeDownloadStatus,
  [CANCEL_DOWNLOAD]: cancelDownload,
  [CHANGE_DOWNLOAD_INFO]: changeDownloadInfo,
  [GOT_DOWNLOAD_INFO]: gotDownloadInfo,
  [SHOW_DOWNLOAD_ERROR]: showDownloadError,
  [TOGGLE_OPEN_WHEN_DONE]: toggleOpenWhenDone,
  [CHANGE_DOWNLOAD_SPEED]: changeDownloadSpeed,
  [UPDATE_BYTES_DOWNLOADED_SHOWN]: updateBytesDownloadedShown,
  [CHOSEN_YOUTUBE_FORMAT]: chosenYouTubeFormat
});

function addNewDownload(state, action) {
  return [
    {
      id: action.id,
      type: action.dtype,
      url: action.url,
      dirname: action.dirname,
      status: action.status
    },
    ...state
  ];
}

function changeDownloadStatus(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { status: action.status })
  );
}

function removeDownload(state, action) {
  return state.filter(download => download.id !== action.id);
}

function changeDownloadUrl(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { url: action.url, res: action.res })
  );
}

function changeDownloadInfo(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      defaultFilename: action.defaultFilename,
      availableFilename: action.availableFilename,
      size: action.size,
      resumable: action.resumable
    })
  );
}

function setDownloadRes(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { res: action.res })
  );
}

function setDownloadShow(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { show: action.show })
  );
}

function gotDownloadInfo(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      status: action.status,
      defaultFilename: action.defaultFilename,
      availableFilename: action.availableFilename,
      speed: action.speed,
      bytesDownloaded: action.bytesDownloaded,
      bytesDownloadedShown: action.bytesDownloadedShown,
      size: action.size,
      resumable: action.resumable,
      show: action.show,
      timestamp: action.timestamp
    })
  );
}

function cancelDownload(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { status: action.status, res: action.res })
  );
}

function showDownloadError(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      status: action.status,
      error: action.error,
      res: action.res
    })
  );
}

function toggleOpenWhenDone(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { openWhenDone: action.value })
  );
}

function changeDownloadSpeed(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { speed: action.speed })
  );
}

function updateBytesDownloadedShown(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      bytesDownloadedShown: action.bytesDownloadedShown
    })
  );
}

function chosenYouTubeFormat(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      defaultFilename: action.defaultFilename,
      availableFilename: action.availableFilename,
      size: action.size,
      format: action.format,
      speed: action.speed,
      bytesDownloaded: action.bytesDownloaded,
      bytesDownloadedShown: action.bytesDownloadedShown,
      status: action.status,
      show: action.show,
      resumable: action.resumable,
      timestamp: action.timestamp
    })
  );
}

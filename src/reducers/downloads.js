import { updateObject, updateItemInArray, createReducer } from './utilities';
import {
  ADD_NEW_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
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
  TOGGLE_OPEN_WHEN_DONE
} from '../actions';

export default createReducer([], {
  [ADD_NEW_DOWNLOAD]: addNewDownload,
  [UPDATE_BYTES_DOWNLOADED]: updateBytesDownloaded,
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
  [TOGGLE_OPEN_WHEN_DONE]: toggleOpenWhenDone
});

function addNewDownload(state, action) {
  return [
    {
      id: action.id,
      url: action.url,
      dirname: action.dirname,
      status: action.status
    },
    ...state
  ];
}

function updateBytesDownloaded(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { bytesDownloaded: action.bytesDownloaded })
  );
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
      bytesDownloaded: action.bytesDownloaded,
      size: action.size,
      resumable: action.resumable,
      show: action.show
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
    updateObject(download, { status: action.status, error: action.error })
  );
}

function toggleOpenWhenDone(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { openWhenDone: action.value })
  );
}

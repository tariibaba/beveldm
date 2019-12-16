import { updateObject, updateItemInArray, createReducer } from './utilities';
import {
  ADD_NEW_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
  CHANGE_DOWNLOAD_BASIC_INFO,
  CHANGE_DOWNLOAD_STATUS,
  REMOVE_DOWNLOAD,
  CHANGE_DOWNLOAD_URL,
  SET_DOWNLOAD_ERROR,
  SET_DOWNLOAD_RES,
  SET_DOWNLOAD_SHOW
} from '../actions';

export default createReducer([], {
  [ADD_NEW_DOWNLOAD]: addNewDownload,
  [UPDATE_BYTES_DOWNLOADED]: updateBytesDownloaded,
  [CHANGE_DOWNLOAD_BASIC_INFO]: changeDownloadBasicInfo,
  [CHANGE_DOWNLOAD_STATUS]: changeDownloadStatus,
  [REMOVE_DOWNLOAD]: removeDownload,
  [CHANGE_DOWNLOAD_URL]: changeDownloadUrl,
  [SET_DOWNLOAD_ERROR]: setDownloadError,
  [SET_DOWNLOAD_RES]: setDownloadRes,
  [SET_DOWNLOAD_SHOW]: setDownloadShow
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
    updateObject(download, { url: action.newUrl, res: action.res })
  );
}

function changeDownloadBasicInfo(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, {
      defaultFilename: action.defaultFilename,
      availableFilename: action.availableFilename,
      size: action.size,
      resumable: action.resumable
    })
  );
}
function setDownloadError(state, action) {
  return updateItemInArray(state, action.id, download =>
    updateObject(download, { error: action.error })
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

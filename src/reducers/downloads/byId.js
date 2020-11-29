import { updateObject, createReducer } from '../utilities';
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
  CHOSEN_YOUTUBE_FORMAT,
  SET_DOWNLOAD_FILE_STREAM,
  TOGGLE_LIMIT_SPEED,
} from '../../actions';

export default createReducer(
  {},
  {
    [ADD_NEW_DOWNLOAD]: addNewDownload,
    [REMOVE_DOWNLOAD]: removeDownload,
    [CHANGE_DOWNLOAD_URL]: changeDownloadUrl,
    [SET_DOWNLOAD_RES]: setDownloadRes,
    [SET_DOWNLOAD_FILE_STREAM]: setDownloadFileStream,
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
    [TOGGLE_LIMIT_SPEED]: toggleLimitSpeed,
    [CHANGE_DOWNLOAD_SPEED]: changeDownloadSpeed,
    [UPDATE_BYTES_DOWNLOADED_SHOWN]: updateBytesDownloadedShown,
    [CHOSEN_YOUTUBE_FORMAT]: chosenYouTubeFormat,
  }
);

function addNewDownload(state, action) {
  const { id, dtype, url, status, show, limitSpeed } = action;
  return {
    [id]: {
      id,
      type: dtype,
      url,
      status,
      show,
      limitSpeed,
    },
    ...state,
  };
}

function changeDownloadStatus(state, action) {
  const { id, status } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      status,
    }),
  });
}

function removeDownload(state, action) {
  const { id } = action;
  const { [id]: removed, ...downloads } = state;
  return downloads;
}

function changeDownloadUrl(state, action) {
  const { id, url, res, fileStream } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      url,
      res,
      fileStream,
    }),
  });
}

function changeDownloadInfo(state, action) {
  const { id, defaultFilename, availableFilename, size, resumable } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      defaultFilename,
      availableFilename,
      size,
      resumable,
    }),
  });
}

function setDownloadRes(state, action) {
  const { id, res } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], { res }),
  });
}

function setDownloadFileStream(state, action) {
  const { id, fileStream } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], { fileStream }),
  });
}

function setDownloadShow(state, action) {
  const { id, show } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], { show }),
  });
}

function gotDownloadInfo(state, action) {
  return updateObject(state, {
    [action.id]: updateObject(state[action.id], {
      status: action.status,
      dirname: action.dirname,
      defaultFilename: action.defaultFilename,
      availableFilename: action.availableFilename,
      speed: action.speed,
      bytesDownloaded: action.bytesDownloaded,
      bytesDownloadedShown: action.bytesDownloadedShown,
      size: action.size,
      resumable: action.resumable,
      show: action.show,
      timestamp: action.timestamp,
      openWhenDone: action.openWhenDone,
    }),
  });
}

function cancelDownload(state, action) {
  const { id, status, res, fileStream } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      status,
      res,
      fileStream,
    }),
  });
}

function showDownloadError(state, action) {
  const { id, status, error, res, fileStream } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      status,
      error,
      res,
      fileStream,
    }),
  });
}

function toggleOpenWhenDone(state, action) {
  const { id, value } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      openWhenDone: value,
    }),
  });
}

function toggleLimitSpeed(state, action) {
  const { id, value } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], { limitSpeed: value }),
  });
}

function changeDownloadSpeed(state, action) {
  const { id, speed } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      speed,
    }),
  });
}

function updateBytesDownloadedShown(state, action) {
  const { id, bytesDownloadedShown } = action;
  return updateObject(state, {
    [id]: updateObject(state[id], {
      bytesDownloadedShown,
    }),
  });
}

function chosenYouTubeFormat(state, action) {
  return updateObject(state, {
    [action.id]: updateObject(state[action.id], {
      dirname: action.dirname,
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
      timestamp: action.timestamp,
      openWhenDone: action.openWhenDone,
    }),
  });
}

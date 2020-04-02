import {
  DOWNLOAD_PROGRESSING,
  NOTIFY,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  CHANGE_PAGE,
  UPDATE_BYTES_DOWNLOADED_SHOWN,
  SET_DOWNLOAD_RES
} from '../actions';
import Store from 'electron-store';

export default function saveState(store) {
  return next => action => {
    const ignoredActionTypes = [
      NOTIFY,
      OPEN_DIALOG,
      CLOSE_DIALOG,
      CHANGE_PAGE,
      DOWNLOAD_PROGRESSING,
      UPDATE_BYTES_DOWNLOADED_SHOWN,
      SET_DOWNLOAD_RES,
    ];

    const result = next(action);

    if (!ignoredActionTypes.includes(action.type)) {
      saveStore(store.getState());
    }

    return result;
  };
}

function saveStore(state) {
  const store = new Store();
  const downloadsToSave = state.downloads
    .map(processDownloadForSaving)
    .filter(isDownloadToBeSaved);

  store.set({
    downloads: downloadsToSave,
    settings: state.settings,
    downloadGroup: state.downloadGroup
  });
}

function processDownloadForSaving(download) {
  const { res, speed, bytesDownloadedShown, ...downloadToSave } = download;

  if (download.status === 'progressing' || download.status === 'paused') {
    const {
      bytesDownloaded,
      ...downloadWithoutBytesDownloaded
    } = downloadToSave;
    return { ...downloadWithoutBytesDownloaded, status: 'paused' };
  }

  return downloadToSave;
}

function isDownloadToBeSaved(download) {
  return (
    download.status !== 'gettinginfo' &&
    download.status !== 'removed' &&
    download.show
  );
}

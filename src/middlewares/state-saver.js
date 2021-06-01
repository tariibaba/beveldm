import {
  DOWNLOAD_PROGRESSING,
  NOTIFY,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  CHANGE_PAGE,
  UPDATE_BYTES_DOWNLOADED_SHOWN,
  CHANGE_DOWNLOAD_GROUP,
  ADD_NEW_DOWNLOAD,
  CHANGE_DOWNLOAD_SPEED,
} from '../actions';
import Store from 'electron-store';
import electronIsDev from 'electron-is-dev';

export default function stateSaver(store) {
  return (next) => (action) => {
    const ignoredActionTypes = [
      NOTIFY,
      OPEN_DIALOG,
      CLOSE_DIALOG,
      CHANGE_PAGE,
      DOWNLOAD_PROGRESSING,
      UPDATE_BYTES_DOWNLOADED_SHOWN,
      CHANGE_DOWNLOAD_GROUP,
      ADD_NEW_DOWNLOAD,
      CHANGE_DOWNLOAD_SPEED,
    ];

    const result = next(action);

    if (!ignoredActionTypes.includes(action.type)) {
      saveStore(store.getState());
    }

    return result;
  };
}

function saveStore(state) {
  const store = new Store({ name: electronIsDev ? 'dev_config' : 'config' });
  const { downloads, settings, downloadGroup } = state;
  const downloadsToSaveById = Object.values(downloads.byId)
    .filter(isDownloadToBeSaved)
    .map(processDownloadForSaving)
    .reduce(
      (downloadsObj, download) => ({
        ...downloadsObj,
        [download.id]: download,
      }),
      {}
    );

  const downloadsToSave = {
    byId: downloadsToSaveById,
    allIds: Object.keys(downloadsToSaveById),
  };

  store.set({
    downloads: downloadsToSave,
    settings,
    downloadGroup,
  });
}

function processDownloadForSaving(download) {
  const {
    res,
    fileStream,
    speed,
    bytesDownloadedShown,
    show,
    ...downloadToSave
  } = download;

  if (download.status === 'progressing' || download.status === 'paused') {
    const { bytesDownloaded, ...downloadWithoutBytesDownloaded } =
      downloadToSave;
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

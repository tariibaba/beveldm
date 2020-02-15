import Store from 'electron-store';
import deleteFile from './delete-file';
import getDownloadPath from './get-download-path';
import Timeout from 'await-timeout';

export default async function saveState(state) {
  const timeout = new Timeout();
  await timeout.set(50);

  const store = new Store();
  const downloadsToSave = state.downloads
    .map(processDownloadForSaving)
    .filter(isDownloadToBeSaved);
  store.set('downloads', downloadsToSave);
  store.set('settings', state.settings);
}

function processDownloadForSaving(download) {
  if (download.status === 'progressing') {
    download.res.destroy();
    download.status = 'paused';
  }

  if (!download.show && download.status !== 'complete') {
    deleteFile(getDownloadPath(download));
  }

  delete download.res;
  delete download.speed;
  delete download.bytesDownloadedShown;
  if (download.status === 'paused') delete download.bytesDownloaded;

  return download;
}

function isDownloadToBeSaved(download) {
  return (
    download.status !== 'gettinginfo' &&
    download.status !== 'removed' &&
    download.show
  );
}

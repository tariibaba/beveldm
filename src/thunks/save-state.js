import thunkPauseDownload from './pause-download';
import Store from 'electron-store';
import { deleteFile, getDownloadPath } from './helpers';

export default function saveState() {
  return async (dispatch, getState) => {
    let state = getState();
    state.downloads.forEach(async download => {
      if (download.status === 'started') {
        await dispatch(thunkPauseDownload(download.id));
      }
      if (!download.show) deleteFile(getDownloadPath(download));
    });

    const store = new Store();
    return new Promise(resolve => {
      setTimeout(() => {
        state = getState();
        store.set(
          'downloads',
          state.downloads
            .filter(
              download =>
                download.status !== 'gettinginfo' &&
                download.status !== 'removed' &&
                download.show
            )
            .map(download => {
              const { bytesDownloaded, res, ...d } = { ...download };
              return d;
            })
        );
        store.set('settings', state.settings);
        resolve();
      }, 50);
    });
  };
}

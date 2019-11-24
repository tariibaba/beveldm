import thunkPauseDownload from './pause-download';
import Store from 'electron-store';
import { deleteFile, getDownloadPath } from './helpers';
import { downloadNotStarted } from '../actions';

export default function saveState() {
  return async (dispatch, getState) => {
    getState().downloads.forEach(async download => {
      if (download.status === 'starting')
        dispatch(downloadNotStarted(download.id));
      if (download.status === 'resuming' || download.status === 'started')
        await dispatch(thunkPauseDownload(download.id));
      if (!download.show) deleteFile(getDownloadPath(download));
    });
    const store = new Store();
    return new Promise(resolve => {
      setTimeout(() => {
        store.set(
          'downloads',
          getState()
            .downloads.filter(
              download =>
                download.status !== 'gettinginfo' &&
                download.status !== 'deleted' &&
                download.show
            )
            .map(download => {
              const { res, ...d } = { ...download };
              return d;
            })
        );
        resolve();
      }, 50);
    });
  };
}

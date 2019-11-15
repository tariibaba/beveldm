import thunkPauseDownload from './pause-download';
import Store from 'electron-store';

export default function saveState() {
  return async (dispatch, getState) => {
    getState().downloads.forEach(async download => {
      await dispatch(thunkPauseDownload(download.id));
    });
    const store = new Store();
    return new Promise(resolve => {
      setTimeout(() => {
        store.set(
          'downloads',
          getState().downloads.map(download => {
            const { res, ...d } = { ...download };
            return d;
          })
        );
        resolve();
      }, 50);
    });
  };
}

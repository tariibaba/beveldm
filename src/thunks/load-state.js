import Store from 'electron-store';
import { updateBytesDownloaded } from '../actions';
import fs from 'fs';
import { getPartialDownloadPath } from './helpers';

export default function loadState() {
  return async (dispatch, getState) => {
    const store = new Store();
    getState().downloads = store.get('downloads') || [];
    getState().downloads.forEach(download => {
      if (download.status === 'paused') {
        const partialPath = getPartialDownloadPath(download);
        dispatch(
          updateBytesDownloaded(download.id, fs.statSync(partialPath).size)
        );
      }
    });
    getState().settings = store.get('settings');
  };
}

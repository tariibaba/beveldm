import { removeDownload, hideDownload, showDownload, notify } from '../actions';
import { getPartialDownloadPath, deleteFile } from './helpers';
import { NOTIFICATION_SHOW_DURATION } from '../constants';
import pathExists from 'path-exists';

export default function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    dispatch(hideDownload(id));

    let download = getState().downloads.find(download => download.id === id);

    const timeout = setTimeout(async () => {
      if (download.status === 'canceled') {
        dispatch(removeDownload(id));
        const partialDownloadPath = getPartialDownloadPath(download);
        if (await pathExists(partialDownloadPath)) {
          await deleteFile(partialDownloadPath);
        }
      }
    }, NOTIFICATION_SHOW_DURATION);

    dispatch(
      notify(
        'info',
        `Removed '${download.availableFilename}' from list`,
        'Undo',
        () => {
          dispatch(showDownload(id));
          clearTimeout(timeout);
        }
      )
    );
  };
}

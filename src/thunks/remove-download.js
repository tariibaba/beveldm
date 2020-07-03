import { removeDownload, notify, showDownload, hideDownload } from '../actions';
import { getPartialDownloadPath, deleteFile } from '../utilities';
import { NOTIFICATION_SHOW_DURATION } from '../constants';
import pathExists from 'path-exists';
import Timeout from 'await-timeout';

export default function removeDownloadThunk(id) {
  return async (dispatch, getState) => {
    dispatch(hideDownload(id));

    const download = getState().downloads.byId[id];

    const timeout = new Timeout();
    timeout.set(NOTIFICATION_SHOW_DURATION).then(async () => {
      if (download.status === 'canceled') {
        dispatch(removeDownload(id));
        const partialDownloadPath = getPartialDownloadPath(download);
        if (await pathExists(partialDownloadPath)) {
          await deleteFile(partialDownloadPath);
        }
      }
    });

    dispatch(
      notify(
        'info',
        `Removed '${download.availableFilename}' from list`,
        'Undo',
        () => {
          dispatch(showDownload(id));
          timeout.clear();
        }
      )
    );
  };
}

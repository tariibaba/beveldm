import { removeDownload, notify, setDownloadShow } from '../actions';
import { getPartialDownloadPath, deleteFile } from '../utilities';
import { NOTIFICATION_SHOW_DURATION } from '../constants';
import pathExists from 'path-exists';

export default function removeDownloadThunk(id) {
  return async (dispatch, getState) => {
    dispatch(setDownloadShow(id, false))

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
          dispatch(setDownloadShow(id, true));
          clearTimeout(timeout);
        }
      )
    );
  };
}

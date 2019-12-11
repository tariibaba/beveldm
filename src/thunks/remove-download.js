import { removeDownload, alert, hideDownload, showDownload } from '../actions';
import { getPartialDownloadPath, deleteFile } from './helpers';
import { NOTIFICATION_SHOW_DURATION } from '../constants';

export default function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    dispatch(hideDownload(id));

    let download = getState().downloads.find(download => download.id === id);

    const timeout = setTimeout(async () => {
      if (download.status === 'canceled') {
        dispatch(removeDownload(id));
        await deleteFile(getPartialDownloadPath(download));
      }
    }, NOTIFICATION_SHOW_DURATION);

    dispatch(
      alert(
        `Removed '${download.availableFilename}' from list`,
        'info',
        () => {
          dispatch(showDownload(id));
          clearTimeout(timeout);
        },
        'Undo'
      )
    );
  };
}

import { removeDownload, alert, hideDownload, showDownload } from '../actions';
import { getPartialDownloadPath, deleteFile } from './helpers';

export default function thunkRemoveDownload(id) {
  return async (dispatch, getState) => {
    let download = getState().downloads.find(download => download.id === id);
    dispatch(hideDownload(id));
    const timeout = setTimeout(async () => {
      if (download.status === 'canceled') {
        dispatch(removeDownload(id));
        await deleteFile(getPartialDownloadPath(download));
      }
    }, 10000);
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

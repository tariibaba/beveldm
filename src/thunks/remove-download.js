import { removeDownload, notify, showDownload, hideDownload } from '../actions';
import { getPartialDownloadPath, deleteFile } from '../utilities';
import pathExists from 'path-exists';

const REMOVED_DOWNLOAD_NOTIFICATION_FILENAME_TRUNCATION_LENGTH = 30;

export default function removeDownloadThunk(id) {
  return async (dispatch, getState) => {
    dispatch(hideDownload(id));

    const download = getState().downloads.byId[id];
    dispatch(
      notify({
        type: 'info',
        message: `Removed '${truncateString(
          download.availableFilename,
          REMOVED_DOWNLOAD_NOTIFICATION_FILENAME_TRUNCATION_LENGTH
        )}' from list`,
        action: 'Undo',
        async responseCallback(responseType) {
          if (responseType === 'undo') {
            dispatch(showDownload(id));
          } else if (responseType === 'timeout') {
            if (download.status === 'canceled') {
              dispatch(removeDownload(id));
              const partialDownloadPath = getPartialDownloadPath(download);
              if (await pathExists(partialDownloadPath)) {
                await deleteFile(partialDownloadPath);
              }
            }
          }
        },
      })
    );
  };
}

function truncateString(str, length) {
  const substring = str.substr(0, length);
  return `${substring}${(str !== substring && '...') || ''}`;
}

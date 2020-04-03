import { changeDownloadSpeed, updateBytesDownloadedShown } from '../actions';
import completeDownloadThunk from './complete-download';

export default function updateDownloadsProgressPeriodically() {
  return async (dispatch, getState) => {
    setInterval(() => {
      getState()
        .downloads.filter((download) => download.status === 'progressing')
        .forEach((download) => {
          const bytesDownloaded = download.bytesDownloaded;
          dispatch(
            changeDownloadSpeed(
              download.id,
              (bytesDownloaded - download.bytesDownloadedShown) * 2
            )
          );

          if (download.status !== 'paused') {
            dispatch(updateBytesDownloadedShown(download.id, bytesDownloaded));
          }

          if (bytesDownloaded === download.size) {
            dispatch(completeDownloadThunk(download.id));
          }
        });
    }, 500);
  };
}

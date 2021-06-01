import { changeDownloadSpeed, updateBytesDownloadedShown } from '../actions';
import completeDownloadThunk from './complete-download';

export default function updateDownloadsProgressPeriodically() {
  return async (dispatch, getState) => {
    setInterval(() => {
      Object.values(getState().downloads.byId)
        .filter((download) => download.status === 'progressing' && download.res)
        .forEach((download) => {
          const bytesDownloaded = download.bytesDownloaded;
          dispatch(
            changeDownloadSpeed(
              download.id,
              (bytesDownloaded - download.bytesDownloadedShown)
            )
          );

          if (download.status !== 'paused') {
            dispatch(updateBytesDownloadedShown(download.id, bytesDownloaded));
          }

          if (bytesDownloaded === download.size) {
            dispatch(completeDownloadThunk(download.id));
          }
        });
    }, 1000);
  };
}

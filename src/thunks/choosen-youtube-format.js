import { chosenYouTubeFormat } from '../actions';
import { getAvailableFilename } from '../utilities';
import startDownload from './start-download';

export default function choosenYouTubeFormatThunk(id, title, format) {
  return async (dispatch, getState) => {
    const downloads = getState().downloads;
    const download = downloads.find(download => download.id === id);
    const filename = `${title}.${format.container}`;
    const availableFilename = await getAvailableFilename(
      download.dirname,
      filename,
      downloads
    );
    dispatch(
      chosenYouTubeFormat(
        id,
        filename,
        availableFilename,
        format.contentLength,
        format,
        getState().settings.alwaysOpenDownloadsWhenDone,
        new Date().toISOString()
      )
    );

    if (getState().settings.startDownloadsAutomatically) {
      dispatch(startDownload(id));
    }

    return Promise.resolve();
  };
}

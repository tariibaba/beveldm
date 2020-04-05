import { chosenYouTubeFormat } from '../actions';
import { getAvailableFilename } from '../utilities';
import startDownload from './start-download';

export default function choosenYouTubeFormatThunk(id, title, format) {
  return async (dispatch, getState) => {
    const { downloads, settings } = getState();
    const download = downloads.byId[id];
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
        settings.alwaysOpenDownloadsWhenDone,
        new Date().toISOString()
      )
    );

    if (settings.startDownloadsAutomatically) dispatch(startDownload(id));
  };
}

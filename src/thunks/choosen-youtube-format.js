import { chosenYouTubeFormat, removeDownload } from '../actions';
import { getAvailableFilename, chooseFile } from '../utilities';
import startDownload from './start-download';
import { remote } from 'electron';

export default function choosenYouTubeFormatThunk(id, title, format) {
  return async (dispatch, getState) => {
    const { downloads, settings } = getState();
    const download = downloads.byId[id];
    const filename = `${title}.${format.container}`;
    const dirname = settings.useCustomSaveFolder
      ? await chooseFile()
      : remote.app.getPath('downloads');

    if (!dirname) {
      dispatch(removeDownload(id));
      return;
    }

    const availableFilename = await getAvailableFilename(
      download.dirname,
      filename,
      downloads
    );
    dispatch(
      chosenYouTubeFormat(
        id,
        dirname,
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

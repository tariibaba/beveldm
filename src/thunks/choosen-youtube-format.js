import { chosenYouTubeFormat, removeDownload } from '../actions';
import { getAvailableFilename, chooseFile } from '../utilities';
import startDownload from './start-download';
import { remote } from 'electron';

export default function choosenYouTubeFormatThunk(id, title, format) {
  return async (dispatch, getState) => {
    const { downloads, settings } = getState();
    const filename = `${title}.${format.container}`;
    const dirname = settings.useCustomSaveFolder
      ? await chooseFile()
      : remote.app.getPath('downloads');

    if (!dirname) {
      dispatch(removeDownload(id));
      return;
    }

    const availableFilename = await getAvailableFilename(
      dirname,
      filename,
      downloads
    );
    dispatch(
      chosenYouTubeFormat({
        id,
        dirname,
        defaultFilename: filename,
        availableFilename,
        size: format.contentLength,
        format,
        openWhenDone: settings.alwaysOpenDownloadsWhenDone,
        timestamp: new Date().toISOString(),
      })
    );

    if (settings.startDownloadsAutomatically) dispatch(startDownload(id));
  };
}

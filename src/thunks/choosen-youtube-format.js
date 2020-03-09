import { chosenYouTubeFormat } from '../actions';
import { getAvailableFilename } from '../utilities';

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
        format
      )
    );

    return Promise.resolve();
  };
}

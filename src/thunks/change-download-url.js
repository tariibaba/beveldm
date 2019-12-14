import thunkPauseDownload from './pause-download';
import { changeDownloadUrl } from '../actions';

export default function thunkChangeDownloadUrl(id, newUrl) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    if (download.status === 'progressing') dispatch(thunkPauseDownload(id));
    dispatch(changeDownloadUrl(id, newUrl));
  };
}

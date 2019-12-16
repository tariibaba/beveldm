import pauseDownload from './pause-download';
import { changeDownloadUrl } from '../actions';

export default function changeDownloadUrlThunk(id, newUrl) {
  return async (dispatch, getState) => {
    const download = getState().downloads.find(download => download.id === id);
    
    if (download.status === 'progressing') {
      dispatch(pauseDownload(id));
    }
    dispatch(changeDownloadUrl(id, newUrl));

    return Promise.resolve();
  };
}

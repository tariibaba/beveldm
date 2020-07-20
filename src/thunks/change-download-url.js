import pauseDownload from './pause-download';
import { changeDownloadUrl } from '../actions';

export default function changeDownloadUrlThunk(id, newUrl) {
  return async (dispatch, getState) => {
    const download = getState().downloads.byId[id];
    if (['progressing', 'error'].includes(download.status)) {
      dispatch(pauseDownload(id));
    }
    dispatch(changeDownloadUrl(id, newUrl));
  };
}

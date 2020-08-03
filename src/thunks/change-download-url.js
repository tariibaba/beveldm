import pauseDownload from './pause-download';
import { changeDownloadUrl, notify } from '../actions';

export default function changeDownloadUrlThunk(id, newUrl) {
  return (dispatch, getState) => {
    let download;
    const changeUrl = (url) => {
      download = getState().downloads.byId[id];
      if (['progressing', 'error'].includes(download.status)) {
        dispatch(pauseDownload(id));
      }
      dispatch(changeDownloadUrl(id, url));
    };
    changeUrl(newUrl);
    const formerUrl = download.url;
    dispatch(
      notify('info', 'Changed URL', 'Undo', (responseType) => {
        if (responseType === 'undo') changeUrl(formerUrl);
      })
    );
  };
}

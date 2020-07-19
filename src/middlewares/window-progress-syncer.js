import { setTaskbarProgress } from '../utilities';
import {
  CANCEL_DOWNLOAD,
  ADD_NEW_DOWNLOAD,
  SHOW_DOWNLOAD_ERROR,
  DOWNLOAD_PROGRESSING,
  COMPLETE_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED_SHOWN,
  GOT_DOWNLOAD_INFO,
  REMOVE_DOWNLOAD,
} from '../actions';

export default function windowProgressSyncer(store) {
  return (next) => (action) => {
    const watchedActionTypes = [
      UPDATE_BYTES_DOWNLOADED_SHOWN,
      CANCEL_DOWNLOAD,
      ADD_NEW_DOWNLOAD,
      SHOW_DOWNLOAD_ERROR,
      DOWNLOAD_PROGRESSING,
      COMPLETE_DOWNLOAD,
      GOT_DOWNLOAD_INFO,
      REMOVE_DOWNLOAD,
    ];

    const result = next(action);

    if (watchedActionTypes.includes(action.type)) {
      setTaskbarProgress(store.getState().downloads);
    }

    return result;
  };
}

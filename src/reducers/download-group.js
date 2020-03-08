import { createReducer } from './utilities';
import { CHANGE_DOWNLOAD_GROUP } from '../actions';

export default createReducer('all', {
  [CHANGE_DOWNLOAD_GROUP]: changeDownloadGroup
});

function changeDownloadGroup(state, action) {
  return action.downloadGroup;
}

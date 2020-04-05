import { createReducer } from '../utilities';
import { ADD_NEW_DOWNLOAD, REMOVE_DOWNLOAD } from '../../actions';

export default createReducer([], {
  [ADD_NEW_DOWNLOAD]: addNewDownload,
  [REMOVE_DOWNLOAD]: removeDownload
});

function addNewDownload(state, action) {
  return state.concat(action.id);
}

function removeDownload(state, action) {
  return state.filter(id => id !== action.id);
}

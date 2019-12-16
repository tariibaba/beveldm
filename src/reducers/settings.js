import { TOGGLE_SAVE_DATA } from '../actions';
import { updateObject, createReducer } from './utilities';

export default createReducer(
  {},
  {
    [TOGGLE_SAVE_DATA]: toggleSaveData
  }
);

function toggleSaveData(state, action) {
  return updateObject(state, { saveData: action.value });
}

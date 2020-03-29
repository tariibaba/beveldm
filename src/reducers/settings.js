import { TOGGLE_SAVE_DATA, TOGGLE_DARK_MODE } from '../actions';
import { updateObject, createReducer } from './utilities';

export default createReducer(
  {},
  {
    [TOGGLE_SAVE_DATA]: toggleSaveData,
    [TOGGLE_DARK_MODE]: toggleDarkMode
  }
);

function toggleSaveData(state, action) {
  return updateObject(state, { saveData: action.value });
}

function toggleDarkMode(state, action) {
  return updateObject(state, { darkMode: action.value });
}

import { TOGGLE_SAVE_DATA, TOGGLE_DARK_MODE, CHANGE_THEME } from '../actions';
import { updateObject, createReducer } from './utilities';

const defaultSettings = {
  saveData: false,
  darkMode: false,
  theme: 'system'
};

export default createReducer(defaultSettings, {
  [TOGGLE_SAVE_DATA]: toggleSaveData,
  [TOGGLE_DARK_MODE]: toggleDarkMode,
  [CHANGE_THEME]: changeTheme
});

function toggleSaveData(state, action) {
  return updateObject(state, { saveData: action.value });
}

function toggleDarkMode(state, action) {
  return updateObject(state, { darkMode: action.value });
}

function changeTheme(state, action) {
  return updateObject(state, { theme: action.value });
}

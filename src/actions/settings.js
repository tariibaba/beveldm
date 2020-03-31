import { TOGGLE_SAVE_DATA, TOGGLE_DARK_MODE, CHANGE_THEME } from './constants';

export function toggleSaveData(value) {
  return {
    type: TOGGLE_SAVE_DATA,
    value
  };
}

export function toggleDarkMode(value) {
  return {
    type: TOGGLE_DARK_MODE,
    value
  };
}

export function changeTheme(value) {
  return {
    type: CHANGE_THEME,
    value
  };
}

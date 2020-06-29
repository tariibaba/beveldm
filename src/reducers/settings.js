import {
  TOGGLE_SAVE_DATA,
  TOGGLE_DARK_MODE,
  CHANGE_THEME,
  TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE,
  TOGGLE_START_DOWNLOADS_AUTOMATICALLY,
  TOGGLE_MINIMIZE_APP_ON_WINDOW_CLOSE,
} from '../actions';
import { updateObject, createReducer } from './utilities';

const defaultSettings = {
  saveData: false,
  darkMode: false,
  theme: 'system',
  alwaysOpenDownloadsWhenDone: false,
  startDownloadsAutomatically: true,
  minimizeAppOnWindowClose: true
};

export default createReducer(defaultSettings, {
  [TOGGLE_SAVE_DATA]: toggleSaveData,
  [TOGGLE_DARK_MODE]: toggleDarkMode,
  [CHANGE_THEME]: changeTheme,
  [TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE]: toggleAlwaysOpenDownloadsWhenDone,
  [TOGGLE_START_DOWNLOADS_AUTOMATICALLY]: toggleStartDownloadsAutomatically,
  [TOGGLE_MINIMIZE_APP_ON_WINDOW_CLOSE]: toggleMinimizeAppOnWindowClose,
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

function toggleAlwaysOpenDownloadsWhenDone(state, action) {
  return updateObject(state, { alwaysOpenDownloadsWhenDone: action.value });
}

function toggleStartDownloadsAutomatically(state, action) {
  return updateObject(state, { startDownloadsAutomatically: action.value });
}

function toggleMinimizeAppOnWindowClose(state, action) {
  return updateObject(state, { minimizeAppOnWindowClose: action.value });
}

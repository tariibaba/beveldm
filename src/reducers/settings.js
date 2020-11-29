import {
  TOGGLE_SAVE_DATA,
  TOGGLE_DARK_MODE,
  CHANGE_THEME,
  TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE,
  TOGGLE_START_DOWNLOADS_AUTOMATICALLY,
  TOGGLE_LAUNCH_AT_STARTUP,
  TOGGLE_USE_CUSTOM_SAVE_FOLDER,
  CHANGE_DOWNLOAD_SPEED_LIMIT,
} from '../actions';
import { updateObject, createReducer } from './utilities';

const defaultSettings = {
  saveData: false,
  darkMode: false,
  theme: 'system',
  alwaysOpenDownloadsWhenDone: false,
  startDownloadsAutomatically: true,
  launchAtStartup: false,
  useCustomSaveFolder: false,
  downloadSpeedLimit: 20 * 1024
};

export default createReducer(defaultSettings, {
  [TOGGLE_SAVE_DATA]: toggleSaveData,
  [TOGGLE_DARK_MODE]: toggleDarkMode,
  [CHANGE_THEME]: changeTheme,
  [TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE]: toggleAlwaysOpenDownloadsWhenDone,
  [TOGGLE_START_DOWNLOADS_AUTOMATICALLY]: toggleStartDownloadsAutomatically,
  [TOGGLE_LAUNCH_AT_STARTUP]: toggleLaunchAtStartup,
  [TOGGLE_USE_CUSTOM_SAVE_FOLDER]: toggleUseCustomSaveFolder,
  [CHANGE_DOWNLOAD_SPEED_LIMIT]: changeDownloadSpeedLimit
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

function toggleLaunchAtStartup(state, action) {
  return updateObject(state, { launchAtStartup: action.value });
}

function toggleUseCustomSaveFolder(state, action) {
  return updateObject(state, { useCustomSaveFolder: action.value });
}

function changeDownloadSpeedLimit(state, action) {
  return updateObject(state, { downloadSpeedLimit: action.value });
}
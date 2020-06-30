import {
  TOGGLE_SAVE_DATA,
  TOGGLE_DARK_MODE,
  CHANGE_THEME,
  TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE,
  TOGGLE_START_DOWNLOADS_AUTOMATICALLY,
  TOGGLE_LAUNCH_AT_STARTUP,
} from './constants';

export function toggleSaveData(value) {
  return {
    type: TOGGLE_SAVE_DATA,
    value,
  };
}

export function toggleDarkMode(value) {
  return {
    type: TOGGLE_DARK_MODE,
    value,
  };
}

export function changeTheme(value) {
  return {
    type: CHANGE_THEME,
    value,
  };
}

export function toggleAlwaysOpenDownloadsWhenDone(value) {
  return {
    type: TOGGLE_ALWAYS_OPEN_DOWNLOADS_WHEN_DONE,
    value,
  };
}

export function toggleStartDownloadsAutomatically(value) {
  return {
    type: TOGGLE_START_DOWNLOADS_AUTOMATICALLY,
    value,
  };
}

export function toggleLaunchAtStartup(value) {
  return {
    type: TOGGLE_LAUNCH_AT_STARTUP,
    value,
  };
}

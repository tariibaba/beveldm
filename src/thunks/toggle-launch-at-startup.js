import { toggleLaunchAtStartup } from '../actions';
import { ipcRenderer } from 'electron';

export default function (value) {
  return (dispatch) => {
    dispatch(toggleLaunchAtStartup(value));
    ipcRenderer.send('toggle-launch-at-startup', value);
  };
}

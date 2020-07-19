import { ipcRenderer } from 'electron';

export default function () {
  ipcRenderer.removeAllListeners('choosen-file');
  return new Promise((resolve) => {
    ipcRenderer.on('choosen-file', (_event, args) => {
      resolve(args);
    });
    ipcRenderer.send('choose-file');
  });
}

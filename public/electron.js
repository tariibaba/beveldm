const {
  ipcMain,
  dialog,
  app,
  BrowserWindow,
  globalShortcut
} = require('electron');
const electronIsDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

let mainWindow;
let reactHasLoaded = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#fff'
  });

  const indexHtmlUrl = url.pathToFileURL(path.resolve('../../build/index.html'))
    .href;
  mainWindow.loadURL(electronIsDev ? 'http://localhost:3000' : indexHtmlUrl);

  if (!electronIsDev) {
    // Prevent reloading of React app
    globalShortcut.register('CommandOrControl+R', () => {});
    mainWindow.setMenu(null);
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', event => {
    if (reactHasLoaded) {
      event.preventDefault();
      mainWindow.webContents.send('before-close', null);
    }
  });

  ipcMain.on('saved', () => {
    mainWindow.destroy();
  });
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('choose-file', async event => {
  const value = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  event.sender.send('choosen-file', value.filePaths[0]);
});

ipcMain.on('set-progress-indeterminate', () => {
  mainWindow.setProgressBar(0, { mode: 'indeterminate' });
});

ipcMain.on('set-progress', (_event, args) => {
  mainWindow.setProgressBar(args);
});

ipcMain.on('clear-progress', () => {
  mainWindow.setProgressBar(0, { mode: 'none' });
});

ipcMain.on('react-loaded', () => {
  reactHasLoaded = true;
});

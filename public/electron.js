const {
  ipcMain,
  dialog,
  app,
  BrowserWindow,
  globalShortcut,
  nativeTheme,
  Tray,
  Menu,
  shell,
} = require('electron');
const electronIsDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
const notifier = require('node-notifier');
const when = require('when-expression');

let mainWindow;
let tray;

let reactHasLoaded = false;
let isAppQuiting = false;

const appId = 'com.tariibaba.beveldm';

toggleLaunchAtStartup(true);

app.on('ready', createWindow);

app.on('before-quit', () => {
  isAppQuiting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('quit', () => {
  tray.destroy();
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('choose-file', async (event) => {
  const value = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
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

ipcMain.on('react-loaded', (event) => {
  reactHasLoaded = true;
  event.reply('system-theme-changed', nativeTheme.shouldUseDarkColors);
});

ipcMain.on('change-theme', (_event, args) => {
  nativeTheme.themeSource = args;
});

ipcMain.on('toggle-launch-at-startup', (_event, args) => {
  toggleLaunchAtStartup(args);
});

ipcMain.on('saved', () => {
  mainWindow.destroy();
});

ipcMain.on('notify-completion', (_event, args) => {
  if (mainWindow.isVisible()) return;

  notifier.notify(
    {
      appName: appId,
      title: 'Download complete',
      message: path.basename(args.filePath),
      icon: path.join(__dirname, 'app-icon.png'),
      actions: ['Show in folder'],
    },
    (_err, response) => {
      if (response === 'activate') mainWindow.show();
      else if (response === 'show in folder') {
        shell.showItemInFolder(args.filePath);
      }
    }
  );
});

ipcMain.on('notify-fail', (_event, args) => {
  if (mainWindow.isVisible()) return;

  const title = when(args.code)({
    EFILECHANGED: 'Failed - File changed',
    EFORBIDDEN: 'Failed - Forbidden',
    ERANGENOTSATISFIABLE: "Failed - Can't resume anymore",
    else: null,
  });
  notifier.notify(
    {
      appName: appId,
      title,
      message: path.basename(args.filePath),
      icon: path.join(__dirname, 'app-icon.png'),
    },
    (_err, response) => {
      if (response === 'activate') mainWindow.show();
    }
  );
});

nativeTheme.on('updated', () => {
  mainWindow.webContents.send(
    'system-theme-changed',
    nativeTheme.shouldUseDarkColors
  );
});

function toggleLaunchAtStartup(value) {
  app.setLoginItemSettings({ openAsHidden: true, openAtLogin: value });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: '#fff',
  });

  const indexHtmlUrl = url.pathToFileURL(path.resolve('./index.html')).href;
  mainWindow.loadURL(electronIsDev ? 'http://localhost:3000' : indexHtmlUrl);

  if (!electronIsDev) setupForProduction();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  installExtensions();

  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.on('close', windowClose);

  initTray();
}

function setupForProduction() {
  // Prevent reloading of React app
  globalShortcut.register('CommandOrControl+R', () => {});
  mainWindow.setMenu(null);
}

function installExtensions() {
  installExtension(REACT_DEVELOPER_TOOLS).then((name) =>
    console.log(`Added extension: ${name}`)
  );
  installExtension(REDUX_DEVTOOLS).then((name) =>
    console.log(`Added extension: ${name}`)
  );
}

function windowClose(event) {
  if (isAppQuiting) {
    if (reactHasLoaded) {
      event.preventDefault();
      mainWindow.webContents.send('before-close', null);
    }
  } else {
    event.preventDefault();
    mainWindow.hide();
  }
}

function initTray() {
  tray = new Tray(path.join(__dirname, './app-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Close',
      type: 'normal',
      click() {
        isAppQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.on('click', () => {
    mainWindow.show();
  });
  tray.setContextMenu(contextMenu);
}

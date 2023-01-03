// main.js

const is_windows = process.platform === 'win32';
const is_mac = process.platform === 'darwin';
const is_linux = process.platform === 'linux';

// Modules to control application life and create native browser window
const { app, globalShortcut, BrowserWindow, screen, Tray, Menu, MenuItem, ipcMain, dialog } = require('electron')
const path = require('path')
//const { localStorage, sessionStorage } = require('electron-browser-storage');

var selected_deviceId = '';
var is_camera_active = false;

var mainWindow;
function createWindow() {

  // Create the browser window.
  let active_screen = screen.getPrimaryDisplay();
  const { width, height } = active_screen.workAreaSize;
  const x = active_screen.workArea.x;
  const y = active_screen.workArea.y;

  mainWindow = new BrowserWindow({
    title: 'nreal3D.js',
    width: width,
    height: height,
    x: x,
    y: y,
    hasShadow: false,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.whenReady().then(() => {

  createWindow()
  let menu = Menu.buildFromTemplate(
    [
      {
        label: app.name,
        submenu: [
          {
            role: 'quit',
            label: `${app.name}を終了`
          }
        ]
      }
    ]);
  Menu.setApplicationMenu(menu);

  if (is_windows) tray = new Tray(`${__dirname}/images/icon.ico`);
  else if (is_mac) tray = new Tray(`${__dirname}/images/icon.png`);

  let tray_menu = Menu.buildFromTemplate([
    // {
    //   label: 'Test',
    //   click(item, focusedWindows) {
    //     mainWindow.webContents.executeJavaScript(`startMediaPipeHands("${selected_deviceId}");`, true)
    //       .then(result => {
    //       }).catch(console.error);
    //   }
    // },
    {
      label: 'About',
      click(item, focusedWindows) {
        const options = {
          type: 'info',  // none/info/error/quetion/warning
          title: 'ABOUT',
          message: `${app.getName()} by Tetsuaki BABA\nVersion: ${app.getVersion()}`,
          detail: `https://github.com/TetsuakiBaba/nreal3d`
        };
        dialog.showMessageBox(options);
      }
    },
    { label: 'Quit', role: 'quit' },
  ]);

  let screens = screen.getAllDisplays();

  var data_append;
  data_append = {
    label: 'Select Display',
    submenu: []
  }
  let sc_count = 0;
  let flg_found = false;
  for (sc of screens) {
    console.log(sc);
    if (sc.size.width == 3840 && sc.size.height == 1080) {
      //if (sc.size.width == 1680 && sc.size.height == 1050) {
      mainWindow.setPosition(sc.workArea.x, sc.workArea.y, true);
      mainWindow.setSize(sc.workArea.width, sc.workArea.height, true);
      flg_found = true;
    }
    sc_count++;
  }
  if (flg_found == false) {
    const options = {
      type: 'error',  // none/info/error/quetion/warning
      title: '',
      message: `Error: nreal air が接続されていないので第一ディスプレイに描画します. `,
      detail: `Please connect nreal air to your computer and restart the app`
    };
    mainWindow.setPosition(screens[0].workArea.x, screens[0].workArea.y, true);
    mainWindow.setSize(screens[0].workArea.width, screens[0].workArea.height, true);
    // dialog.showMessageBox(options);
    dialog.showMessageBox(options).then(result => {
      console.log('pressed OK')
      //app.quit();
      //test
    }).catch(err => {
      console.log(err)
    })
  }

  tray.on('click', function () {
    tray.popUpContextMenu(tray_menu);
  });
  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  });
  mainWindow.setFullScreenable(false);
  mainWindow.setAlwaysOnTop(true, "screen-saver")
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //tray_menu.insert(2, new MenuItem(data_append));
  // var ret = globalShortcut.register('ctrl+shift+t', function () {
  //   //console.log('finger tips trail');
  //   mainWindow.webContents.executeJavaScript(`toggleFingerTipsTrail();`, true)
  //     .then(result => {
  //     }).catch(console.error);
  // });



})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('will-quit', function () {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});


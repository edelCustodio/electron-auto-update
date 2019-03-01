const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const dotenv  = require('dotenv');

dotenv.config();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';


function createWindow() {
    //check for updates
    autoUpdater.checkForUpdatesAndNotify();
    
    let win = new BrowserWindow({ width: 800, height: 600 });
    win.loadFile('index.html');

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
  
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

/**
 * Update app
 */

/**
 * Envia notificacion a la pantalla principal
 * acerca del status de la actualizacion
 * @param {*} text Texto a enviar
 */
function sendStatusToWindow(text) {
    let title = mainWindow.getTitle();
    mainWindow.setTitle(title + ": " + text);
    log.info(text);
  }
  
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
  });
  
  
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
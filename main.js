import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

async function sendData () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {

  } else {
    return filePaths[0]
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('./html/index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('data:sendData', sendData)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
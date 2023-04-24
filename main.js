const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Define the async function for sending the data to the renderer process.
async function sendData () {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
  const dataArray = JSON.parse(data);
  mainWindow.webContents.send()
};

ipcMain.handle('data:sendData', sendData)

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolated: false
    }
  })
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('./html/index.html')
}

app.whenReady().then(() => {
    console.log('App is loading');
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
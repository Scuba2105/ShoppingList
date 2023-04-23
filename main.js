const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// async function sendData () {
//   const data = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
//   const dataArray = JSON.parse(data);
//   return JSON.stringify(dataArray);
// }

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('./html/index.html')
}

// Event handler for asynchronous request for data
app.on('requestData', (event, arg) => {
  console.log(arg)

  // Event emitter for sending asynchronous messages
  event.sender.send('dataSent', JSON.stringify({one: 123, two: 456}));
});

app.whenReady().then(() => {
    console.log('App is loading');
    //ipcMain.handle('data:sendData', sendData)
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
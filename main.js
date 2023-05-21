const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { DateTime } = require("luxon");

//define the main window
let win;

// Define the async function for sending the data to the renderer process.
async function sendWeeklyData() {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
  const dataArray = JSON.parse(data);
  return dataArray
};

ipcMain.handle('data:sendWeeklyData', sendWeeklyData);

ipcMain.on('data:saveData', (event, list) => {
  const listArray = JSON.parse(list);
  
  // Monday is 1 through to Sunday which is 7. 
  const currentDate = DateTime.now();
  const dayOfWeek = currentDate.weekday;
  let daysElapsed;
  if (dayOfWeek == 1) {
    daysElapsed = 6;
  }
  else {
    daysElapsed = dayOfWeek - 2;
  }
  const daysToEnd = 6 - daysElapsed;
  const dateEnd = currentDate.plus({days: daysToEnd}).ts;
  const storedDataObject = {endTimeStamp: dateEnd, shoppingListData: listArray};
  const storedDataString = JSON.stringify(storedDataObject, null, 2);
  fs.writeFileSync(path.join(__dirname, 'data', 'current_data.json'), storedDataString);
  win.webContents.send('save-data-success', 'Data successfully saved!');
});

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolated: false
    }
  })
  win = mainWindow;
  mainWindow.setMenu(null);
  mainWindow.webContents.on('did-finish-load', () => {
    const version = require('./package.json').version;
    const windowTitle = `Shopping List Generator v${version}`;
    mainWindow.setTitle(windowTitle);
  });
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
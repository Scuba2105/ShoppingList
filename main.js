const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { DateTime } = require("luxon");

// Define the async function for sending the data to the renderer process.
async function sendWeeklyData() {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
  const dataArray = JSON.parse(data);
  return dataArray
};

ipcMain.handle('data:sendWeeklyData', sendWeeklyData);

ipcMain.on('data:saveData', (event, list) => {
  const listArray = JSON.parse(list);
  // Need to use when sending data
  const testDate = DateTime.fromISO("2023-05-07");

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
  const dateStart = daysElapsed == 0 ? currentDate : currentDate.minus({ days: daysElapsed}).toISO().split('T')[0];
  const dateEnd = currentDate.plus({days: daysToEnd}).toISO().split('T')[0];
  // Need to use for sending data on load
  //const currentInterval = Interval.fromDateTimes(dateStart, dateEnd);
  const storedData = {startDate: dateStart, endDate: dateEnd, shoppingListData: listArray};
  console.log(JSON.stringify(storedData));
})

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolated: false
    }
  })
  mainWindow.setMenu(null);
  mainWindow.webContents.on('did-finish-load', () => {
    const version = require('./package.json').version;
    const windowTitle = `Shopping List Generator v${version}`;
    mainWindow.setTitle(windowTitle);
  });
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
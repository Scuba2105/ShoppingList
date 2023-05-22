const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { DateTime } = require("luxon");
const setupPug = require("electron-pug");
const { getEndDate } = require("./utilities/util")

//define the main window
let win;
let win2;
let pug;

// Define the async function for sending the data to the renderer process.
async function sendWeeklyData() {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'shopping_items.json'))
  const dataArray = JSON.parse(data);
  return dataArray
};

ipcMain.handle('data:sendWeeklyData', sendWeeklyData);

ipcMain.on('data:saveData', (event, list) => {
  const listArray = JSON.parse(list);
  
  // Get the end date for the current shopping week
  const dateEnd = getEndDate();
  const storedDataObject = {endTimeStamp: dateEnd.ts, shoppingListData: listArray};
  const storedDataString = JSON.stringify(storedDataObject, null, 2);
  fs.writeFileSync(path.join(__dirname, 'data', 'current_data.json'), storedDataString);
  win.webContents.send('save-data-success', 'Data successfully saved!');
});

ipcMain.on('data:generateData',async (event, list) => {
  try {
    const shoppingList = JSON.parse(list);
    const itemArray = [];
    const itemCategories = ['Fresh Produce','Dairy','Grains & Cereals','Baking','Frozen','Oils & Seasoning',
    'Snacks, Spreads & Drink','Cleaning & Household'];
    itemCategories.forEach((itemCategory) => {
      const categoryItems = shoppingList.filter((item) => {
        return item.category == itemCategory;
      })
      const classAtt = itemCategory.toLowerCase().replace(/\s/g, '-').replace('&', '').replace(',','').replace('--', '-');
      categoryObject = {category: itemCategory, classAttribute: classAtt, items: categoryItems};
      itemArray.push(categoryObject);
    });

    const endDateArray = getEndDate().toISO().split('T')[0].split('-');
    const endDate = `${endDateArray[2]}/${endDateArray[1]}/${endDateArray[0]}`
    const pugLocals = {date: endDate, data: itemArray};
    pug = await setupPug({pretty: true}, pugLocals);
    pug.on('error', err => console.error('electron-pug error', err));
    createFinalListWindow();   
  } catch (error) {
    console.log(error);
  }
});

function createFinalListWindow() {
  try {
    const finalListWindow = new BrowserWindow({
      width: 1133,
      height: 804,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolated: false
      }
    })
    win2 = finalListWindow;
    win2.setMenu(null);
    win2.webContents.on('did-finish-load', () => {
      const version = require('./package.json').version;
      const windowTitle = `Shopping List Generator v${version}`;
      win2.setTitle(windowTitle);
    });
    win2.webContents.openDevTools();
    win2.loadFile('./pug/final-list.pug');
  } catch (error) {
    console.log(error);
  }
   
}

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
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendWeeklyData: () => ipcRenderer.invoke('data:sendWeeklyData'),
  saveData: (shoppingList) => ipcRenderer.send('data:saveData', shoppingList),
  listenForSave: () => ipcRenderer.on('save-data-success', (evt, message) => {
    const messageBox = document.querySelector('.alert-message');
    const primaryMessage = document.querySelector('.primary-message');
    const additionalMessage = document.querySelector('.additional-message');
    primaryMessage.textContent = 'Success!';
    additionalMessage.textContent = message;
    messageBox.style.display = 'grid';
  }),
  generateData: (shoppingList) => ipcRenderer.send('data:generateData', shoppingList)  
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendWeeklyData: () => ipcRenderer.invoke('data:sendWeeklyData'),
  saveData: (shoppingList) => ipcRenderer.send('data:saveData', shoppingList),
  listenForSave: () => ipcRenderer.on('save-data-success', (evt, message) => {
    const messageBox = document.querySelector('.alert-message');
    const messageText = document.querySelector('.message-text');
    messageText.textContent = message;
    messageBox.style.display = 'grid'; 
  })   
});
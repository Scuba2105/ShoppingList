const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendWeeklyData: () => ipcRenderer.invoke('data:sendWeeklyData')
});
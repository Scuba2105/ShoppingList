import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendData: () => ipcRenderer.invoke('data:sendData')
})
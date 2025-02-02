// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronBridge", {
  sendEvent: (eventName) =>
    ipcRenderer.invoke("three-js-game-events", eventName),
  setItem: (key, value) => ipcRenderer.invoke("storage", "set", key, value),
  getItem: (key) => ipcRenderer.invoke("storage", "get", key),
  removeItem: (key) => ipcRenderer.invoke("storage", "remove", key),
});

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronBridge", {
  sendEvent: (eventName) =>
    ipcRenderer.invoke("three-js-game-events", eventName),
});

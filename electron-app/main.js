// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { app, BrowserWindow, ipcMain, Menu } = require("electron");

Menu.setApplicationMenu(null);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 420,
    height: 190,
    backgroundColor: "#000000",
    titleBarStyle: "hidden",
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: __dirname + "/preload.js",
    },
    show: false,
  });

  win.loadFile("public/index.html");

  return win;
};

app.whenReady().then(() => {
  const win = createWindow();
  ipcMain.handle("three-js-game-events", (event, eventName) => {
    if (eventName === "showWindow") {
      win.show();
    } else if (eventName === "exit") {
      app.quit();
    } else if (eventName === "openFullscreen") {
      win.setFullScreen(true);
    }
    return "done";
  });

  win.on("leave-full-screen", () => {
    win.setSize(800, 600);
  });
});

app.on("window-all-closed", () => {
  // eslint-disable-next-line no-undef
  if (process.platform !== "darwin") app.quit();
});

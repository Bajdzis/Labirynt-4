/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const fs = require("fs");
const path = require("path");

Menu.setApplicationMenu(null);

// TODO" replace by https://github.com/sindresorhus/env-paths/tree/main
const userDataDir =
  process.env.APPDATA ||
  (process.platform == "darwin"
    ? process.env.HOME + "/Library/Preferences"
    : process.env.HOME + "/.local/share");

const appPath = path.resolve(userDataDir, "Bajdzis Software", "Labirynt 4");

const storageMemory = {};
fs.stat(path.join(appPath, "saves"), (err) => {
  if (err) {
    fs.mkdirSync(path.join(appPath, "saves"), { recursive: true });
  } else {
    fs.readdirSync(path.join(appPath, "saves")).forEach((file) => {
      if (!file.endsWith(".json")) {
        return;
      }
      const key = file.replace(".json", "");
      storageMemory[key] = fs.readFileSync(
        path.join(appPath, "saves", file),
        "utf8",
      );
    });
  }
});

ipcMain.handle("storage", (event, action, key, value) => {
  if (action === "set") {
    storageMemory[key] = value;
    fs.writeFile(
      path.join(appPath, "saves", `${key}.json`),
      value,
      {
        encoding: "utf8",
      },
      () => {},
    );
  } else if (action === "get") {
    return storageMemory?.[key] ?? null;
  } else if (action === "remove") {
    delete storageMemory[key];
    fs.unlink(path.join(appPath, "saves", `${key}.json`));
  }
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 420,
    height: 190,
    backgroundColor: "#000000",
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
  if (process.platform !== "darwin") app.quit();
});

import { app, BrowserWindow } from "electron";
import path from "path";

app.disableHardwareAcceleration();

const inDevelopment = process.env.NODE_ENV === "development";

if (require("electron-squirrel-startup")) {
    app.quit();
}

function createWindow() {
    const preload = path.join(__dirname, "preload.js");
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            devTools: inDevelopment,
            contextIsolation: true,
            nodeIntegration: false,
            preload: preload
        },
        titleBarStyle: "hidden",
    });

    if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/index.html`));
    }

    mainWindow.webContents.on('will-navigate', (event, url) => {
      event.preventDefault();
      require('electron').shell.openExternal(url);
    });

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self'"]
        }
      });
    });

    mainWindow.webContents.openDevTools();

    return mainWindow
}

app.whenReady().then(createWindow);

//osX only
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        const mainWindow = createWindow();
    }
});
//osX only ends

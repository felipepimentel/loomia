import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // Segurança: Isola contextos do renderer e main
      nodeIntegration: false,  // Desabilitar integração Node.js no renderer
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Escutar mensagens do renderer
  ipcMain.on('channel-name', (event, data) => {
    console.log(`Received ${data} from renderer process`);
    // Enviar uma resposta de volta ao renderer
    event.reply('channel-reply', 'Reply from main process');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

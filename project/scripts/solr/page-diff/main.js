const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os')

app.commandLine.appendSwitch('ignore-certificate-errors')

let mainWin, win1, win2;

const args = process.argv.slice(2);
let config_file = "config.json"
if (args.length > 0) {
  config_file = args[0]
}
let config = JSON.parse(fs.readFileSync(config_file, 'utf-8'));
if (!config.hasOwnProperty('dev_tools')) {
  config.dev_tools = "closed"
}
if (!config.hasOwnProperty('viewport')) {
  config.viewport = {"width": 1024, "height": 600}
}

// modify your existing createWindow() function
const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            // preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html').then(() => {
      win.send("search:data", config)
    })

    return win;
}

// modify your existing createWindow() function
const createWindow = () => {
    let x, y;

    x = y = 0;
    const currentWindow = BrowserWindow.getFocusedWindow();
    if (currentWindow) {
        const [ currentWindwoX, currentWindwoY ] = currentWindow.getPosition();
        x = currentWindwoX + 1280;
        y = currentWindwoY + 0;
    }
    const win = new BrowserWindow({
        x : x,
        y : y,
        width: config.viewport.width,
        height: config.viewport.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    return win;
}

// ...
app.whenReady().then(() => {

    mainWin = createMainWindow()
    if (config.dev_tools == "open") {
        mainWin.openDevTools()
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('form:submit', (event, data) => {
    console.log(data)

    if (win1 == null) {
        win1 = createWindow()
        if (config.dev_tools == "open") {
            win1.openDevTools()
        }
    }
    win1.loadURL(data.src + data.region + '/search?keywords=' + data.keywords).then(() => {
        win1.setTitle(data.src_id + " " + win1.getTitle())
        let payload = {"target": data.src_id, "find": data.link}
        if (data.link.includes("link:")) {
            win1.send("find:link", payload)
        } else if (data.link.includes("node:")) {
            win1.send("find:node", payload)
        } else {
            win1.send("find:text", payload);
        }
    })

    if (win2 == null) {
        win2 = createWindow()
        if (config.dev_tools == "open") {
            win2.openDevTools()
        }
    }
    win2.loadURL(data.dest + data.region + '/search?keywords=' + data.keywords).then(() => {
        win2.setTitle(data.dest_id + " " + win2.getTitle())
        let payload = {"target": data.dest_id, "find": data.link}
        if (data.link.includes("link:")) {
            win2.send("find:link", payload)
        } else if (data.link.includes("node:")) {
            win2.send("find:node", payload)
        } else {
            win2.send("find:text", payload);
        }
    })
});

ipcMain.on('search:response', (event, data) => {
    mainWin.send("search:stats", data)
})

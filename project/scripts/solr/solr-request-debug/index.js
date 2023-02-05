const {app, BrowserWindow, ipcMain, net, shell} = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

app.commandLine.appendSwitch('ignore-certificate-errors')

let mainWin

let config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))

const createWindow = (w, h) => {
  const win = new BrowserWindow({
    width: w,
    height: h,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html').then(() => {
    win.send("search:data", config)
  })

  return win
}

app.whenReady().then(() => {
  mainWin = createWindow(1024, 800)
  mainWin.openDevTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('form:submit', (event, data) => {
  console.log(data)
  const request = net.request(data.host + data.handler + data.request)
  let resp = ''
  request.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`)
      resp += chunk
    })
    response.on('end', () => {
      // console.log('No more data in response.')
      // console.log(resp)
      let solrResponse = JSON.parse(resp)
      mainWin.send("search:solrResponse", solrResponse)

      // // console.log(sr.response.numFound, sr.response.maxScore)
      // let explain = solrResponse.debug.explain
      // // console.log(explain)
      // for (const [key, value] of Object.entries(explain)) {
      //     console.log(key, value);
      // }
    })
  })
  request.end()
});

ipcMain.on('luke:id', (event, data) => {
  console.log(data)
  shell.openExternal(data.host + data.handler + data.request, '_blank')
});

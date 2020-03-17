// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const DataStore = require('./renderer/MusicDataStore')
const myStore = new DataStore({ 'name': 'Music Data' })
class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      }
    }

    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}
app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    // console.log('page did finish load')
    mainWindow.send('getTracks', myStore.getTracks())
  })
  //mainWindow.loadFile('./renderer/index.html')

  // mainWindow.webContents.openDevTools()

  ipcMain.on('add-music-window', () => {
    const addWindow = new BrowserWindow({
      width: 500,
      height: 400,
      webPreferences: {
        nodeIntegration: true
      },
      parent: mainWindow
    })
    addWindow.loadFile('./renderer/add.html')
    //addWindow.webContents.openDevTools()
  })
  ipcMain.on('add-tracks', (event, tracks) => {

    const updatedTracks = myStore.addTracks(tracks).getTracks()
    //console.log(updatedTracks)
    mainWindow.send('getTracks', updatedTracks)
  })
  ipcMain.on('delete-track', (event, id) => {
    const updatedTracks = myStore.deleteTrack(id).getTracks()
    mainWindow.send('getTracks', updatedTracks)

  })
  ipcMain.on('open-music-file', (event) => {
    // console.log('open')
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Music', extensions: ['mp3'] }]
    }).then(result => {
      // console.log(result.filePaths)
      if (result) {
        event.sender.send('selected-file', result.filePaths)
        // console.log("result have been sent")
      }
    }).catch(err => {
      // console.log(err)
    })

  })
})

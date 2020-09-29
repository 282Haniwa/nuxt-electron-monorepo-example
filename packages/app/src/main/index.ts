import http from 'http'
import path from 'path'
import electron from 'electron'
import envList from '../renderer/env'

const environment = process.env.NODE_ENV || 'app_production'
// @ts-ignore
const env = envList[environment]
const isDev = env.NODE_ENV === 'development'

let _NUXT_URL_ = ''
if (isDev) {
  _NUXT_URL_ = `http://${env.NUXT_HOST}:${env.NUXT_PORT}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)
} else {
  // eslint-disable-next-line no-path-concat
  _NUXT_URL_ =
    'file://' + path.resolve(__dirname, '../../dist/nuxt-build/index.html')
}
console.log(env, _NUXT_URL_)

let win: any = null
const app = electron.app
const newWin = () => {
  win = new electron.BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      webSecurity: false,
    },
  })
  win.on('closed', () => (win = null))
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name: any) => {
        console.log(`Added Extension:  ${name}`)
        win.webContents.openDevTools()
      })
      .catch((err: any) => console.log('An error occurred: ', err))
    const pollServer = () => {
      http
        .get(_NUXT_URL_, (res: any) => {
          if (res.statusCode === 200) {
            win.loadURL(_NUXT_URL_)
          } else {
            console.log('restart poolServer')
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }
    pollServer()
  } else {
    return win.loadURL(_NUXT_URL_)
  }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())

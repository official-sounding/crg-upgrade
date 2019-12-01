import {app, BrowserWindow, dialog, ipcMain as ipc, Menu } from 'electron'
import isDev from 'electron-is-dev'
import { join } from 'path'
import { format as formaturl } from 'url'

let win: BrowserWindow

const createWindow = () => {
    win = new BrowserWindow({
        title: 'CRG Upgrade Utility',
       // icon: join(__dirname, '../build/flamingo-white.png'),
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadURL(formaturl({
        pathname: join(__dirname, './index.html'),
        protocol: 'file',
        slashes: true,
    }))

    if (isDev) {
        win.webContents.openDevTools()
        require('devtron').install()
    }

    // Prevent files dropped outside of the drop zone from doing anything.
    win.webContents.on('will-navigate', (event) => event.preventDefault())

    win.on('closed', () => {
        win = null
    })

    win.webContents.on('crashed', () => {
        dialog.showMessageBox(win, {
            type: 'error',
            title: 'CRG Upgrade Utility',
            message: 'CRG Upgrade Utility has crashed.  This should probably not surprise you.',
        })
    })

    win.on('unresponsive', () => {
        dialog.showMessageBox(win, {
            type: 'error',
            title: 'CRG Upgrade Utility',
            // tslint:disable-next-line: max-line-length
            message: 'CRG Upgrade Utility has become unresponsive.  You should probably have been more emotionally supportive.',
        })
    })

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator:  'CmdOrCtrl+Q',
                    click() {
                        app.quit()
                    },
                },
            ],
        },
    ])
    Menu.setApplicationMenu(menu)

    // Do version check
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('do-version-check', app.getVersion())
    })

    win.webContents.on('new-window', (e, url) => {
        e.preventDefault()
        require('electron').shell.openExternal(url)
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win == null) {
        createWindow()
    }
})

ipc.on('error-thrown', (event: any, msg: any, url: any, lineNo: any, columnNo: any) => {
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'CRG Upgrade Utility',
        message: `CRG Upgrade Utility has encountered an error.
        Here's some details:
        Message: ${msg}
        URL: ${url}
        Line Number: ${lineNo}
        Column Number: ${columnNo}
        Does this help?  It probably doesn't help.`,
    })
})

process.on('uncaughtException', (err) => {
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'CRG Upgrade Utility',
        // tslint:disable-next-line: max-line-length
        message: `CRG Upgrade Utility has had an uncaught exception in main.js.  Does this help? (Note: will probably not help.) ${err}`,
    })
})

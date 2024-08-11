import { IpcMainEvent, ipcMain } from "electron";

export namespace events {

    const listeners: { [key: string]: ((event: IpcMainEvent, ...args: any[]) => void)[] } = {}
    let mainWindow: Electron.BrowserWindow
    export function init(window: Electron.BrowserWindow) {
        mainWindow = window
    }
    export function addRendererListener(eventName: string, listener: (event: IpcMainEvent, ...args: any[]) => void) {
        if (!listeners[eventName]) {
            listeners[eventName] = []
            ipcMain.on(eventName, (event: IpcMainEvent, ...args: any[]) => {
                listeners[eventName].forEach(listener => listener(event, ...args))
            })
        }
        listeners[eventName].push(listener)
    }

    export function removeRendererListener(eventName: string, listener: (event: IpcMainEvent, ...args: any[]) => void) {
        if (listeners[eventName]) {
            for (let i = 0; i < listeners[eventName].length; i++) {
                if (listeners[eventName][i] === listener) {
                    listeners[eventName].splice(i, 1)
                    break
                }
            }
            if (listeners[eventName].length === 0) {
                delete listeners[eventName]
            }
        }
    }

    export function dispatchToRenderer(eventName: string, ...args: any[]) {
        mainWindow.webContents.send(eventName, ...args);
    }
}



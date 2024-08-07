import { IpcRendererEvent } from 'electron';
import { makeInstaller } from 'element-plus';

export namespace Events {

    const listeners: { [key: string]: ((event: IpcRendererEvent, ...args: any[]) => void)[] } = {}
    let mainWindow: Electron.BrowserWindow
    export function init(mainWindow: Electron.BrowserWindow) {
        mainWindow = mainWindow
    }
    export function addMainListener(eventName: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        if (!listeners[eventName]) {
            listeners[eventName] = []
            window.electron.ipcRenderer.on(eventName, (event: IpcRendererEvent, ...args: any[]) => {
                listeners[eventName].forEach(listener => listener(event, ...args))
            })
        }
        listeners[eventName].push(listener)
    }

    export function dispatchToMain(eventName: string, ...args: any[]) {
        mainWindow.electron.ipcRenderer.send(eventName, ...args)
    }
}





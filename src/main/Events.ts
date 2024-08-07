import { IpcMainEvent, ipcMain } from "electron";

export namespace Events {

    const listeners: { [key: string]: ((event: IpcMainEvent, ...args: any[]) => void)[] } = {}

    export function addRendererListener(eventName: string, listener: (event: IpcMainEvent, ...args: any[]) => void) {
        if (!listeners[eventName]) {
            listeners[eventName] = []
            ipcMain.on(eventName, (event: IpcMainEvent, ...args: any[]) => {
                listeners[eventName].forEach(listener => listener(event, ...args))
            })
        }
        listeners[eventName].push(listener)
    }

    export function dispatchToRenderer(eventName: string, ...args: any[]) {
        window.webContents.send(eventName, ...args);
    }
}



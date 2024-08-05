import { BrowserWindow, IpcMainEvent, ipcMain } from "electron";

export namespace Events {

    export function addRendererListener(eventName: string, listener: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.on(eventName, (event: IpcMainEvent, ...args: any[]) => {
            listener(event, ...args)
        })
    }

    export function dispatchToRenderer(window: BrowserWindow, eventName: string, ...args: any[]) {
        window.webContents.send(eventName, ...args);
    }
}



import { IpcRendererEvent } from 'electron';

export namespace Events {
    export function addMainListener(eventName: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        window.electron.ipcRenderer.on(eventName, (event: IpcRendererEvent, ...args: any[]) => {
            listener(event, ...args)
        })
    }

    export function dispatchToMain(eventName: string, ...args: any[]) {
        window.electron.ipcRenderer.send(eventName, ...args)
    }
}



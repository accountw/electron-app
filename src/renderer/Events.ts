import { IpcRendererEvent } from 'electron';


export namespace events {

    const listeners: { [key: string]: ((event: IpcRendererEvent, ...args: any[]) => void)[] } = {}

    export function addMainListener(eventName: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        if (!listeners[eventName]) {
            listeners[eventName] = []
            window.electron.ipcRenderer.on(eventName, (event: IpcRendererEvent, ...args: any[]) => {
                listeners[eventName].forEach(listener => listener(event, ...args))
            })
        }
        listeners[eventName].push(listener)
    }

    export function removeMainListener(eventName: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
        if (listeners[eventName]) {
            for (let i = 0; i < listeners[eventName].length; i++) {
                if (listeners[eventName][i] === listener) {
                    listeners[eventName].splice(i, 1)
                    break
                }
            }
            if (listeners[eventName].length === 0) {
                delete listeners[eventName]
                window.electron.ipcRenderer.removeAllListeners(eventName)
            }
        }
    }

    export function dispatchToMain(eventName: string, ...args: any[]) {
        window.electron.ipcRenderer.send(eventName, ...args)
    }
}





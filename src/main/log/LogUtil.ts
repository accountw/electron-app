import { BrowserWindow } from 'electron'
import { Const } from '../../lib/Const';
import { Events } from '../Events';

export namespace LogUtil {

    let logWindow: BrowserWindow;

    export function init(mainWindow: BrowserWindow) {
        logWindow = mainWindow;
    }
    export function log(msg: string) {
        const data = { msg: msg, level: Const.LogLevel.LOG };
        showLog(data);
    }

    export function error(msg: string) {
        const data = { msg: msg, level: Const.LogLevel.ERROR };
        showLog(data);
    }

    export function warn(msg: string) {
        const data = { msg: msg, level: Const.LogLevel.WARN };
        showLog(data);
    }

    function showLog(data: { msg: string, level: Const.LogLevel }) {

        if (logWindow) {
            console.log(JSON.stringify(data));
            Events.dispatchToRenderer(logWindow, Const.LOG, data);
        }
    }
}


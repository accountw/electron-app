
import { constant } from '../../lib/constant';
import { events } from '../events';

export namespace logUtil {

    export function log(msg: string) {
        const data = { msg: msg, level: constant.LogLevel.LOG };
        showLog(data);
    }

    export function error(msg: string) {
        const data = { msg: msg, level: constant.LogLevel.ERROR };
        showLog(data);
    }

    export function warn(msg: string) {
        const data = { msg: msg, level: constant.LogLevel.WARN };
        showLog(data);
    }

    function showLog(data: { msg: string, level: constant.LogLevel }) {
        console.log(data);
        events.dispatchToRenderer(constant.LOG, data);
    }

}


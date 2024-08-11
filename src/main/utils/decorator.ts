
import "reflect-metadata";
import { IoCContainer } from "./IoCContainer";
import { events } from "../events";
import { IpcMainEvent } from "electron";
import { error } from "../../lib/mainResponse";
import { logUtil } from "../log/logUtil";

export namespace decorator {

    /**
     * 注册服务
     * @param constructor 
     */
    export function Injectable<T extends { new(): {} }>(constructor: T) {
        IoCContainer.register(constructor.name, constructor);
    }

    /**
     * 服务注入
     * @param constructor 
     * @returns 
     */
    export function Inject<T extends { new(): {} }>(constructor: T) {
        return function (target: any, propertyKey: string) {
            const instance = IoCContainer.resolve(constructor.name);
            target[propertyKey] = instance;
        }
    };

    /**
     * 注册路由
     * @param path 
     */
    export function Route(path: string) {
        return function (target: any, propertyKey: string) {
            events.addRendererListener(path, async (event: IpcMainEvent, ...args: any[]) => {
                event.returnValue = 1;
                try {
                    const data = await target[propertyKey](...args);
                    events.dispatchToRenderer(path, data);
                } catch (e) {
                    const data = error(e);
                    if (e instanceof Error) {
                        logUtil.error(e.message);
                    }
                    events.dispatchToRenderer(path, data);
                }
            })
        }
    }

}


import "reflect-metadata";
import { IoCContainer } from "./IoCContainer";
import { events } from "../events";
import { IpcMainEvent } from "electron";
import { error } from "console";

export namespace decorator {

    export function Injectable<T extends { new(): {} }>(constructor: T) {
        IoCContainer.register(constructor.name, constructor);
    }

    export function Inject<T extends { new(): {} }>(constructor: T) {
        //注入
        return function (target: any, propertyKey: string) {
            const instance = IoCContainer.resolve(constructor.name);
            target[propertyKey] = instance;
        }
    };

    /**
     * 注册ipc路由
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
                    events.dispatchToRenderer(path, data);
                }
            })
        }
    }

}

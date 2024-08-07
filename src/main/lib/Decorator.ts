
import "reflect-metadata";
import { IoCContainer } from "./IoCContainer";
import { Events } from "../Events";
import { IpcMainEvent } from "electron";

export namespace Decorator {

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
    export function Ipc(path: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Events.addRendererListener(path, (event: IpcMainEvent, ...args: any[]) => {
                target[propertyKey](event, ...args);
            })
        }
    }

}



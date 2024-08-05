import { IoCContainer } from "./IoCContainer";

export namespace Decorator {

    export function Injectable<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                IoCContainer.register(constructor.name, this);
            }
        };
    }

    export function Inject(target: any, propertyKey: string) {
        const className = Reflect.getMetadata("design:type", target, propertyKey).name;
        const getter = () => {
            return IoCContainer.get(className);
        };
        Object.defineProperty(target, propertyKey, {
            get: getter,
            enumerable: true,
            configurable: true,
        });
    }

    export function Controller<T extends { new(...args: any[]): {} }>(constructor: T) {
        Injectable(constructor);
    }

    export function Ipc() {

    }


}
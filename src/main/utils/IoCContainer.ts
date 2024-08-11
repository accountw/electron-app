export class IoCContainer {
    private static instances = new Map<string, any>();
    private static classMap = new Map<string, any>();

    static register<T>(className: string, classConstructor: new (...args: any[]) => T): void {
        if (!this.classMap.has(className)) {
            this.classMap.set(className, classConstructor);
        }
    }

    static resolve<T>(className: string): T {
        if (this.instances.has(className)) {
            return this.instances.get(className);
        }
        const classConstructor = this.classMap.get(className);
        if (!classConstructor) {
            throw new Error(`Class not found: ${className}`);
        }
        const instance = new classConstructor();
        this.instances.set(className, instance);
        return instance;
    }

}
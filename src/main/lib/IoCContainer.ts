export class IoCContainer {
    private static instances = new Map<string, any>();

    static get<T>(className: string): T {
        const instance = this.instances.get(className);
        if (!instance) {
            throw new Error(`No instance found for class: ${className}`);
        }
        return instance;
    }

    static register<T>(className: string, instance: T): void {
        this.instances.set(className, instance);
    }
}
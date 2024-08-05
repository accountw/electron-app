import { JsonUtil } from "./JsonUtil";

export class DataManager {

    //单例
    private static _instance: DataManager;
    public static get instance(): DataManager {
        if (!this._instance) {
            this._instance = new DataManager();
        }
        return this._instance;
    }

    path: string = "C:\\Users\\Public\\jurryrun\\jurryrun.json"
    saveData(data: any) {
        JsonUtil.writeJSONFile(this.path, data)
    }

    readData<T>(): T {
        return JsonUtil.readJSONFile(this.path) as T;
    }
}

export type JsonData = {
    url: string;
}